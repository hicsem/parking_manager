"use strict"
const { Model } = require("sequelize")
const { Op } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Parking, {
        foreignKey: {
          allowNull: false,
        },
      })
      Booking.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      })
    }
  }
  Booking.init(
    {
      from: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      to: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (booking) => {
          const startDate = booking.dataValues.from
          const endDate = booking.dataValues.to

          let bookingExist = await Booking.findOne({
            where: {
              ParkingId: booking.dataValues.ParkingId,
              [Op.or]: [
                {
                  from: {
                    [Op.between]: [startDate, endDate],
                  },
                },
                {
                  to: {
                    [Op.between]: [startDate, endDate],
                  },
                },
                {
                  [Op.and]: [
                    {
                      from: {
                        [Op.lt]: startDate,
                      },
                    },
                    {
                      to: {
                        [Op.gt]: endDate,
                      },
                    },
                  ],
                },
              ],
            },
          })

          if (bookingExist) {
            throw { message: "You can't book in that period" }
          }
        },
        beforeUpdate: async (booking) => {
          // ? A booking cannot be updated we should be removed it and create a new one
        },
      },
      sequelize,
      tableName: "Booking",
      modelName: "Booking",
    }
  )
  return Booking
}
