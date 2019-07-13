// class User {
//     constructor(id,{username, password}){
//         this.id = id
//         this.username = username
//         this.password = password
//     }
// }

// module.exports = {
//     User
// }

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: DataTypes.STRING(20),
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        password: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        first_name: {
          type: DataTypes.STRING(45),
          allowNull: false
        },
        last_name:{
          type: DataTypes.STRING(45),
          allowNull: false
        }
      },
      {
        timestamps: false,
        freezeTableName: true,
      }
    );
  
    // User.associate = (models) => {
    //   User.belongsTo(models.terminal);
    // };
  
    return User;
}