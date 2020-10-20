'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    UserId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    Email: {
      type: DataTypes.STRING,
      unique: true
    },
    Username: {
      type: DataTypes.STRING,
      unique: true,
    },
    Password: DataTypes.STRING,
    Admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

  }, {});

  return users;
  };



