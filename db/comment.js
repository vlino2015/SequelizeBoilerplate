'use strict';
module.exports = (sequelize, DataTypes) => {
  var comment = sequelize.define('comment', {
    title: DataTypes.STRING,
    body: DataTypes.STRING
  }, {});

  // creating an association between comment and post
  comment.associate = function(models) {
    comment.belongsTo(models.post, {as : 'post',foreignKey : 'postId'})
  }

  return comment;
};