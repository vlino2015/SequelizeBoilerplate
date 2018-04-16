'use strict';
module.exports = (sequelize, DataTypes) => {
  var post = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});


  return post;
};