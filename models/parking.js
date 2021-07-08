"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Parking extends Model {
    static associate(models) {
      Parking.hasMany(models.Booking, {
        onDelete: "cascade",
      })
    }
  }
  Parking.init(
    {
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    },
    {
      hooks: {
        beforeCreate: async (parking) => {
          let spaceExist = await Parking.findOne({
            where: {
              number: parking.dataValues.number,
              floor: parking.dataValues.floor,
            },
          })
          if (spaceExist) {
            throw { message: "Space Already Exists" }
          }
        },
        beforeUpdate: async (parking) => {
          let spaceExist = await Parking.findOne({
            where: {
              number: parking.dataValues.number,
              floor: parking.dataValues.floor,
            },
          })
          if (spaceExist && parking.id !== spaceExist.id) {
            throw { message: "Space Already Exists" }
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
