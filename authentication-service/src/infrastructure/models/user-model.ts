import UrlMonitor from './../../../../url-monitoring-service/src/infrastructure/models/url-monitor-model';
import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from '.';

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  username?: string;
  isVerified: boolean;
  mobileNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const User = sequelize.define<UserInstance>('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  username: {
    type: DataTypes.STRING, 
    unique: true,
  },
  password: {
    type: DataTypes.STRING
  },
  isVerified: {
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    unique: true,
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
  }
});

// export const urlMonitor = User.hasMany(UrlMonitor, {
//   as: 'urlMonitor',
//   foreignKey: 'userId',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

export default User;
