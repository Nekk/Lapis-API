const Sequelize = require('sequelize')
const constant = require('./constant')

const sequelize = new Sequelize(constant.dbTable, constant.dbUsername, constant.dbPassword, {
    host: 'localhost',
    port:'3306',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
let models = {}

models.User = require('../model/User.js')(sequelize, Sequelize)

module.exports = {
    sequelize,
    models
}

// sequelize
// .authenticate()
// .then(() => {
//       console.log('Connection has been established successfully.');
// })
// .catch(err => {
//       console.error('Unable to connect to the database:', err);
// });