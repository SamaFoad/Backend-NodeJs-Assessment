'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('url_monitors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        // onDelete: 'CASCADE',
        // references: {
        //   model: 'users',
        //   key: 'id',
        // },
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      numberOfDowns: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      numberOfUps: {
        type: Sequelize.INTEGER, 
        default: 0
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('urls_monitor');
  }
};
