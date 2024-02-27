'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {foreignKey: 'userId', as: 'author'})
      this.hasMany(models.Comment, {foreignKey: 'articleId', as: 'comments'})
    }
  }
  Article.init({
    title: DataTypes.STRING,
    imageArticle: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};