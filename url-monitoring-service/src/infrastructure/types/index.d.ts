import { Model } from 'sequelize';
export type SequelizeUpdateReturnValue<T> = [number, (T & Model<{}, {}>)[]];
export type SequelizeUpsertReturnValue<T> = [T & Model<any>, boolean]