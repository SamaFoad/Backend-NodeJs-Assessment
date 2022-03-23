import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from '.';

export interface NotificationAttributes {
  id?: number;
  sender: string;
  reciever: string;
  description: string;
  sendingType: string;
  actionType: string; 
  isSent: boolean;
}
export interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id'> { }

export interface NotificationInstance extends Model<NotificationAttributes, NotificationCreationAttributes>, NotificationAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Notification = sequelize.define<NotificationInstance>('notifications', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
  },
  isSent: {
    type: DataTypes.BOOLEAN, 
  },
  sendingType: {
    type: DataTypes.STRING
  },
  actionType: {
    type: DataTypes.STRING,
  },
  sender: {
    type: DataTypes.STRING,
  },
  reciever: {
    type: DataTypes.STRING,
  },
});
export default Notification;
