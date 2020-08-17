const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FactCategory extends Model {
    static associate(_models) {
      // define association here
    }
  }
  FactCategory.init(
    {
      name: DataTypes.STRING,
      factCount: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'FactCategory'
    }
  );
  return FactCategory;
};
