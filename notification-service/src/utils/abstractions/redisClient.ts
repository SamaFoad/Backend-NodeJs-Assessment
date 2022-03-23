export default interface RedisClient {
  set(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
  delete(key: string): Promise<void>;
  createQueue(queue: string): Promise<void>;
  deleteQueue(queue: string): Promise<void>;
  enqueue(queue: string, itemsOrItem: any | any[]): Promise<void>;
  dequeue(queue: string, limit: number): Promise<any[]>;
  queueExists(queue: string): Promise<boolean>;
  keyExists(key: string): Promise<boolean>;
  close(): Promise<void>;
}
