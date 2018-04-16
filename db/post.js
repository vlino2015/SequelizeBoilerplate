'use strict';
module.exports = (sequelize, DataTypes) => {
  var post = sequelize.define('posts', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    author: DataTypes.STRING,
    authorName: DataTypes.STRING
  }, {});

  post.associate = function(models) {
    post.hasMany(models.comment,{as : 'comments',foreignKey : 'postId'})
  }

  return post;
};

// module.exports = (sequelize, DataTypes) => {
//   var post = sequelize.define('post', {
//     title: DataTypes.STRING,
//     body: DataTypes.STRING
//   }, {});