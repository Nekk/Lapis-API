const Sequelize = require('sequelize')
const constant = require('./constant')

const sequelize = new Sequelize(constant.dbTable, constant.dbUsername, constant.dbPassword, {
    // host: 'localhost',
    host: 'lapis-aws.cy7n5dci1oim.ap-southeast-1.rds.amazonaws.com',
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

models.user = require('../model/user.js')(sequelize, Sequelize)
models.expo_token = require('../model/expo_token.js')(sequelize, Sequelize)

models.expo_token.belongsTo(models.user)

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