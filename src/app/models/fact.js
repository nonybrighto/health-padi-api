const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Fact.belongsTo(models.FactCategory, {
        foreignKey: 'categoryId',
        as: 'category'
      });
    }
  }
  Fact.init(
    {
      content: {
        type: DataTypes.TEXT
      },
      type: {
        type: DataTypes.STRING
      },
      categoryId: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: 'Fact'
    }
  );
  return Fact;
};
