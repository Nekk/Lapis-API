module.exports = (sequelize, DataTypes) => {
    const expo_token = sequelize.define('expo_token', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        token: {
          type: DataTypes.STRING(50),
          unique: true
        },
        userId: {
          type: DataTypes.INTEGER,
          unique: true
        },
      },
      {
        timestamps: false,
        freezeTableName: true,
      }
    );

    return expo_token;
}