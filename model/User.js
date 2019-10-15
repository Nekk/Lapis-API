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
    const user = sequelize.define('user', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: DataTypes.STRING(20),
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        password: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        firstName: {
          type: DataTypes.STRING(45),
          allowNull: false
        },
        lastName:{
          type: DataTypes.STRING(45),
          allowNull: false
        },
        // profilePicture:{
        //   type: DataTypes.Byte
        //   allowNull: true
        // }
      },
      {
        timestamps: false,
        freezeTableName: true,
      }
    );
  
    // User.associate = (models) => {
    //   User.belongsTo(models.terminal);
    // };
  
    return user;
}