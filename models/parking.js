"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Parking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Parking.belongsTo(models.User, { foreignKey: { unique: true } })
    }
  }
  Parking.init(
    {
      number: {
        type: DataTypes.INTEGER,
        allowNull: {
          args: false,
          msg: "You can't create a parking space without a number",
        },
      },
      floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
    },
    {
      hooks: {
        beforeCreate: async (parking) => {
          let spaceExist = await Parking.findOne({
            where: {
              number: parking.number,
              floor: parking.floor,
            },
          })
          if (spaceExist) {
            throw { message: "Space Already Exist" }
          }
          if (parking.UserId) {
            parking.available = false
          } else {
            parking.available = true
          }
        },
        beforeUpdate: async (parking) => {
          let spaceExist = await Parking.findOne({
            where: {
              number: parking.number,
              floor: parking.floor,
            },
          })
          if (
            spaceExist &&
            spaceExist.dataValues.id !== parking.dataValues.id
          ) {
            throw {
              message:
                "A parking space with the same floor and number already Exist",
            }
          }
          if (parking.UserId) {
            parking.available = false
          } else {
            parking.available = true
          }
        },
      },
      sequelize,
      tableName: "Parking",
      modelName: "Parking",
    }
  )
  return Parking
}
