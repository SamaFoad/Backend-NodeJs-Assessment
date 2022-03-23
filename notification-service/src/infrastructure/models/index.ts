import { Sequelize } from 'sequelize';
const config = require(__dirname + '/../config/config.js');
const sequelize = config.url ? new Sequelize(config.url, config) : new Sequelize(config.database, config.username, config.password, config);
export { Sequelize, sequelize };
