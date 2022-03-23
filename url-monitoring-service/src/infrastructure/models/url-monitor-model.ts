import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from '.';

export interface UrlMonitorAttributes {
  id?: number;
  userId?: number;
  url: string;
  name?: string;
  status?: string;
  numberOfUps?: number;
  numberOfDowns?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UrlMonitorCreationAttributes extends Optional<UrlMonitorAttributes, 'id'> { }

export interface UrlMonitorInstance extends Model<UrlMonitorAttributes, UrlMonitorCreationAttributes>, UrlMonitorAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const UrlMonitor = sequelize.define<UrlMonitorInstance>('url_monitors', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: 'users',
    //   key: 'id',
    // },
  },
  url: {
    type: DataTypes.STRING, 
  },
  name: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM,
    values: ['UP', 'DOWN'],
    defaultValue: 'UP'
  },
  numberOfUps: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  numberOfDowns: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});
export default UrlMonitor;
