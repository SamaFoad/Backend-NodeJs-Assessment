'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      sendingType: {
        type: Sequelize.DataTypes.ENUM,
        values: ['automated', 'manual'],
        allowNull: false,
      },
      actionType:{
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      isSent:{
        type: Sequelize.DataTypes.BOOLEAN,
        default: false,  
        allowNull: false,
      },
      sender: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      reciever: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notifications');
  }
};
