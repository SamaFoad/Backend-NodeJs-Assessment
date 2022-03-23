import redis, { RedisClient as Client } from "redis";
import { cleanEnv, num, str } from "envalid";

const cleanedEnv = cleanEnv(process.env, {
  REDIS_CLIENT_POOL_SIZE: num({ default: 1 }),
  REDIS_CLIENT_REDIS_URL: str({ default: "localhost" }),
  REDIS_CLIENT_REDIS_KEY: str({ default: undefined }),
  REDIS_CLIENT_REDIS_PORT: num({ default: 6379 }),
});

process.env = Object.assign(process.env, cleanedEnv);

class RedisClient {
  private static connectionPool: Client[] = [];
  private static roundRobinIndex = 0;
  private static maxPoolSize = +process.env.REDIS_CLIENT_POOL_SIZE;
  private static subscriber: Client;

  private static QUEUE_EXISTS_FLAG = "QUEUE_EXISTS_FLAG";

  static CommandError = class CommandError extends Error {
    redisError: redis.RedisError;

    constructor(redisError: redis.RedisError) {
      super("Error occurred while executing command");

      this.name = "RedisClient::CommandException";
      this.redisError = redisError;
    }
  };

  static QueueNotFoundError = class QueueNotFoundError extends Error {
    queue: string;

    constructor(queue: string) {
      super(`${queue} not found`);

      this.name = "RedisClient::QueueNotFoundException";
      this.queue = queue;
    }
  };

  set(key: string, value: any): Promise<void> {
    const client: Client = this.acquireConnection();
    return new Promise((resolve, reject) => {
      client.set(key, this.serialize(value), (error, reply) => {
        if (error) return reject(new RedisClient.CommandError(error));
        resolve();
      });
    });
  }

  get(key: string): Promise<any> {
    const client: Client = this.acquireConnection();

    return new Promise((resolve, reject) => {
      client.get(key, (error, value: string) => {
        if (error) return reject(new RedisClient.CommandError(error));

        if (!value || value == "nil") return resolve(undefined);

        resolve(this.deSerialize(value));
      });
    });
  }

  delete(key: string): Promise<void> {
    const client: Client = this.acquireConnection();
    return new Promise((resolve, reject) => {
      client.del(key, (error, numberDeleted: number) => {
        if (error) return reject(new RedisClient.CommandError(error));

        resolve();
      });
    });
  }

  async createQueue(queue: string): Promise<void> {
    const client: Client = this.acquireConnection();
    if (await this.queueExists(queue)) return Promise.resolve();
    else
      return new Promise((resolve, reject) => {
        client.lpush(
          `queue_${queue}`,
          RedisClient.QUEUE_EXISTS_FLAG,
          (error, sizeOfQueue: number) => {
            if (error) return reject(new RedisClient.CommandError(error));

            resolve();
          }
        );
      });
  }

  deleteQueue(queue: string): Promise<void> {
    return this.delete(`queue_${queue}`);
  }

  enqueue(queue: string, items: any[]): Promise<void>;
  enqueue(queue: string, item: any): Promise<void>;
  async enqueue(queue: string, itemsOrItem: any | any[]): Promise<void> {
    const client: Client = this.acquireConnection();
    if (!(await this.queueExists(queue)))
      return Promise.reject(new RedisClient.QueueNotFoundError(queue));

    if (!Array.isArray(itemsOrItem)) itemsOrItem = [itemsOrItem];

    itemsOrItem = itemsOrItem.map((item) => this.serialize(item));

    return new Promise((resolve, reject) => {
      client.rpush(
        `queue_${queue}`,
        itemsOrItem,
        (error, sizeOfQueue: number) => {
          if (error) return reject(new RedisClient.CommandError(error));

          resolve();
        }
      );
    });
  }

  async dequeue(queue: string, limit: number = 1): Promise<any[]> {
    const client: Client = this.acquireConnection();
    if (limit < 1) return Promise.resolve([]);

    if (!(await this.queueExists(queue)))
      return Promise.reject(new RedisClient.QueueNotFoundError(queue));

    return new Promise((resolve, reject) => {
      client.lrange(`queue_${queue}`, 1, limit, (error, items: string[]) => {
        if (error) return reject(new RedisClient.CommandError(error));

        client
          .multi()
          .ltrim(`queue_${queue}`, items.length + 1, -1)
          .lpush(`queue_${queue}`, RedisClient.QUEUE_EXISTS_FLAG)
          .exec((err, replies) => {
            if (error) return reject(new RedisClient.CommandError(error));

            resolve(items.map((item) => this.deSerialize(item)));
          });
      });
    });
  }

  queueExists(queue: string): Promise<boolean> {
    return this.keyExists(`queue_${queue}`);
  }

  keyExists(key: string): Promise<boolean> {
    const client: Client = this.acquireConnection();
    return new Promise((resolve, reject) => {
      client.exists(key, (error, numberExisting: number) => {
        if (error) return reject(new RedisClient.CommandError(error));

        if (numberExisting > 0) resolve(true);
        else resolve(false);
      });
    });
  }

  close(): Promise<void> {
    if (RedisClient.connectionPool.length == 0 && !RedisClient.subscriber)
      return;

    const clients = [].concat(RedisClient.connectionPool);

    if (RedisClient.subscriber) clients.push(RedisClient.subscriber);

    return new Promise((resolve, reject) => {
      for (let i = 0; i < clients.length; i++) {
        clients[i].quit((error, reply: string) => {
          if (error) return reject(new RedisClient.CommandError(error));
        });
      }
      resolve();
    });
  }

  subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    if (!RedisClient.subscriber) RedisClient.subscriber = redis.createClient();

    return new Promise((resolve, reject) => {
      RedisClient.subscriber.subscribe(channel, (error, reply) => {
        if (error) return reject(new RedisClient.CommandError(error));
        RedisClient.subscriber.on("message", (ch: string, msg: string) => {
          if (ch == channel) callback(this.deSerialize(msg));
        });
        resolve();
      });
    });
  }

  unSubscribe(channel: string): Promise<void> {
    if (!RedisClient.subscriber) return;

    return new Promise((resolve, reject) => {
      RedisClient.subscriber.unsubscribe(channel, (error, reply) => {
        if (error) return reject(new RedisClient.CommandError(error));

        resolve();
      });
    });
  }

  publish(channel: string, message: any): Promise<void> {
    const client: Client = this.acquireConnection();
    return new Promise((resolve, reject) => {
      client.publish(channel, this.serialize(message), (error, reply) => {
        if (error) return reject(new RedisClient.CommandError(error));

        resolve();
      });
    });
  }

  addToStream(streamKey: string, ...data: any): Promise<String> {
    const client: any = this.acquireConnection();
    return new Promise((resolve, reject) => {
      client.xadd(streamKey, "*", ...data, (error, reply) => {
        if (error) return reject(new RedisClient.CommandError(error));
        resolve(reply);
      });
    });
  }

  listenOverAstream(
    applicationId: string,
    consumerId: string,
    streamsKey: string,
    blockDuration = 0
  ): Promise<any> {
    const client: any = this.acquireConnection();
    return new Promise((resolve, reject) => {
      client.xgroup(
        "CREATE",
        streamsKey,
        applicationId,
        "0",
        "MKSTREAM",
        function (error, group) {
          if (!error || error.code == "BUSYGROUP") {
            const addingPromise = new Promise((resolve, reject) => {
              client.xreadgroup(
                "GROUP",
                applicationId,
                consumerId,
                "BLOCK",
                blockDuration,
                "STREAMS",
                streamsKey,
                ">",
                function (error, stream) {
                  if (error) return reject(new RedisClient.CommandError(error));
                  if (stream) {
                    let messages = stream[0][1];
                    // print all messages
                    let msgs = [];
                    messages.forEach(function (message) {
                      // convert the message into a JSON Object
                      let id = message[0];
                      let values = message[1];
                      let msgObject = { id: id };
                      for (let i = 0; i < values.length; i = i + 2) {
                        msgObject[values[i]] = values[i + 1];
                      }
                      msgs.push(msgObject);
                    });
                    resolve(msgs);
                  }
                  resolve(null);
                }
              );
            });
            resolve(addingPromise);
          } else {
            if (error) reject(new RedisClient.CommandError(error));
          }
        }
      );
    });
  }

  hashSet(queue: string, key: string, value: any): Promise<any> {
    const client: Client = this.acquireConnection();
    return new Promise((resolve, reject) => {
      client.hset(queue, key, this.serialize(value), (error, reply) => {
        if (error) return reject(new RedisClient.CommandError(error));
        resolve(reply);
      });
    });
  }

  hashGet(queue: string, key: string, clear: boolean): Promise<any> {
    const client: Client = this.acquireConnection();

    return new Promise((resolve, reject) => {
      client.hget(queue, key, (error, value: string) => {
        if (error) return reject(new RedisClient.CommandError(error));

        if (!value || value == "nil") return resolve(undefined);
        const result = this.deSerialize(value);
        if (clear) client.hdel(queue, key);
        resolve(result);
      });
    });
  }

  hashGetAll(queue: string, clear: boolean): Promise<any> {
    const client: Client = this.acquireConnection();

    return new Promise((resolve, reject) => {
      client.hgetall(queue, (error, value: { [key: string]: string }) => {
        if (error) return reject(new RedisClient.CommandError(error));
        if (!value) return resolve(undefined);
        resolve(
          Object.keys(value).reduce((obj, key) => {
            obj[key] = this.deSerialize(value[key]);
            return obj;
          }, {})
        );
        if (clear) client.del(queue);
        resolve(undefined);
      });
    });
  }

  private serialize(obj: any): string {
    return JSON.stringify(obj);
  }

  private deSerialize(str: string): any {
    return JSON.parse(str);
  }

  private acquireConnection() {
    if (RedisClient.connectionPool.length == 0)
      for (let i = 0; i < RedisClient.maxPoolSize; i++) {
        const client = redis.createClient(
          parseInt(process.env.REDIS_CLIENT_REDIS_PORT),
          process.env.REDIS_CLIENT_REDIS_URL,
          process.env.REDIS_CLIENT_REDIS_KEY &&
            process.env.REDIS_CLIENT_REDIS_KEY != "undefined" &&
            process.env.REDIS_CLIENT_REDIS_KEY != undefined
            ? {
                auth_pass: process.env.REDIS_CLIENT_REDIS_KEY,
                tls: { servername: process.env.REDIS_CLIENT_REDIS_URL },
              }
            : {}
        );
        RedisClient.connectionPool.push(client);
      }

    return RedisClient.connectionPool[
      RedisClient.roundRobinIndex++ % RedisClient.maxPoolSize
    ];
  }
}

export = RedisClient;
