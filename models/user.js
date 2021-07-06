"use strict"
const bcrypt = require("bcrypt")

const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Parking)
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: "Invalid email" },
        },
      },
      hashedPassword: {
        type: DataTypes.STRING(255),
      },
      password: {
        type: DataTypes.VIRTUAL,
        set(value) {
          this.setDataValue("password", value)
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password && user.password.length > 6) {
            const salt = await bcrypt.genSaltSync(10, "a")
            user.hashedPassword = bcrypt.hashSync(user.password, salt)
          } else {
            throw { message: "Password too short" }
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            if (user.password.length > 6) {
              const salt = await bcrypt.genSaltSync(10, "a")
              user.hashedPassword = bcrypt.hashSync(user.password, salt)
            } else {
              throw { message: "Password too short" }
            }
          }
        },
      },
      instanceMethods: {
        validPassword: (password) => {
          return bcrypt.compareSync(password, this.password)
        },
      },
      sequelize,
      tableName: "User",
      modelName: "User",
    }
  )
  User.prototype.validPassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash)
  }
  return User
}
