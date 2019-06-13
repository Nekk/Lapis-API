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
        email: DataTypes.TEXT,
        username: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        password: {
          type: DataTypes.TEXT,
          allowNull: false
        },
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