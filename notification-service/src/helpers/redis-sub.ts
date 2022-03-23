import { getDateNow } from './../common/util';
import RedisClient from 'redis-client';
import NotificationRepository from '../infrastructure/repositories/NotificationRepository';
import { NotificationAttributes, NotificationCreationAttributes } from '../infrastructure/models/notification-model';
import sendEmail from '../helpers/mailSender';
import { injectable } from 'tsyringe';
import async from 'async';
import { Logger } from 'logging';
import { Log, ErrorLog } from '../common/constants/logMessages';

@injectable()
export default class NotificationSubscriber {
  constructor(private queueProvider: RedisClient, private notificationRepository: NotificationRepository) {
    const logger = new Logger();
    const repository = this.notificationRepository;
    async.forever(
      function (next) {
        setTimeout(() => {
          queueProvider
            .listenOverAstream(process.env.CONSUMER_GROUP, process.env.CONSUMER_INSTANCE, process.env.NOTIFCIATION_STREAM, 100)
            .then(data => {
              if (data) {
                const notifications: NotificationCreationAttributes[] = NotificationSubscriber.parseLogsFromTopic(data);
                repository.createNotifications(notifications)
                .then((data) => {
                  var i;
                  const sz = data.length;
                  for(i=0; i<sz; i++){
                    notifications[i].id = data[i].id;
                  }
                })
                notifications.forEach((notification:NotificationCreationAttributes)=>{
                  const dateNow = getDateNow();
                  sendEmail(notification, dateNow)
                  .then(() => {
                    notification.isSent = true;
                    notificationRepository.updateIsSentNotification(notification.id, notification);
                    logger.info(Log.EMAIL_SENT_SUCCESS);
                    }
                  );
                })
              }
            })
            .catch(err => {
              logger.error(ErrorLog.EMAIL_FAILURE);
            });
          next();
        }, 2000);
      },
      function (error) {
        console.error(error);
        return;
      },
    );
  }
  public static parseLogsFromTopic(data: any): NotificationCreationAttributes[] {
    const notifications: NotificationCreationAttributes[] = [];
    data.forEach(item => {
      const notification: NotificationCreationAttributes = {
        description: item.description,
        sender: item.sender,
        reciever: item.reciever,
        sendingType: 'automated',
        actionType: item.actionType,
        isSent: false,
      };
      notifications.push(notification);
    });
    return notifications;
  }
}
