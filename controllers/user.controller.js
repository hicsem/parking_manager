const { User } = require("../models")
const extend = require("lodash/extend")

const create = async (req, res) => {
  try {
    const user = User.build({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!",
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

const list = async (req, res) => {
  try {
    let users = await User.findAll({
      attributes: ["name", "email"],
    })
    return res.status(200).json(users)
  } catch (err) {
    return res.status(400).json(err)
  }
}

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findByPk(id)
    if (!user) {
      return res.status("400").json({
        error: "User not found",
      })
    }
    req.profile = user
    next()
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve user",
    })
  }
}

const read = (req, res) => {
  return res.json({
    id: req.profile.dataValues.id,
    name: req.profile.dataValues.name,
    email: req.profile.dataValues.email,
  })
}

const update = async (req, res) => {
  try {
    let user = req.profile
    user = extend(user, req.body)
    await user.save()
    return res.status(200).json({
      id: user.dataValues.id,
      name: user.dataValues.name,
      email: user.dataValues.email,
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.destroy()
    return res.status(200).json({
      id: deletedUser.dataValues.id,
      name: deletedUser.dataValues.name,
      email: deletedUser.dataValues.email,
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

module.exports = { create, list, userByID, read, update, remove }
