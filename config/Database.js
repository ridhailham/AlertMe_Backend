const { Sequelize } = require("sequelize");

const db = new Sequelize(
    'papb',
    'root',
    '',
    {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        pool: {
            max: 100,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

module.exports = db;