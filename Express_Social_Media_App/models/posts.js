'use strict';
module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define('posts', {
    PostId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    PostTitle: DataTypes.STRING,
    PostBody: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER,
      foreignKey: true
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    PostDate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }

  }, {});
  
  return posts;
};

