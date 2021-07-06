const { Parking } = require("../models")
const extend = require("lodash/extend")
// const { User } = require("../models")

const createParkingSpace = async (req, res) => {
  try {
    let space = Parking.build({
      number: req.body.number,
      floor: req.body.floor,
      available: req.body.available,
      UserId: req.body.UserId,
    })
    await space.save()
    return res.status(200).json({
      message: `Successfully added the parking space number :${space.number} on floor :${space.floor}`,
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

const listParkingSpaces = async (req, res) => {
  try {
    let spaces = await Parking.findAll({
      attributes: ["number", "floor", "available"],
    })
    return res.status(200).json(spaces)
  } catch (err) {
    return res.status(400).json(err)
  }
}

const parkingByID = async (req, res, next, id) => {
  try {
    let space = await Parking.findByPk(id)
    if (!space) {
      return res.status("400").json({
        error: "Parking space not found",
      })
    }
    req.parkingSpace = space
    next()
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve parking space",
    })
  }
}

const getParkingSpace = async (req, res) => {
  return res.json({
    id: req.parkingSpace.dataValues.id,
    number: req.parkingSpace.dataValues.number,
    floor: req.parkingSpace.dataValues.floor,
    available: req.parkingSpace.dataValues.available,
  })
}
const updateParkingSpace = async (req, res) => {
  try {
    let space = req.parkingSpace
    space = extend(space, req.body)
    await space.save()
    return res.status(200).json({
      id: space.dataValues.id,
      number: space.dataValues.number,
      floor: space.dataValues.floor,
      available: space.dataValues.available,
      userId: space.dataValues.userId,
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}
const removeParkingSpace = async (req, res) => {
  try {
    let space = req.parkingSpace
    let deletedSpace = await space.destroy()
    return res.status(200).json({
      id: deletedSpace.dataValues.id,
      number: deletedSpace.dataValues.number,
      floor: deletedSpace.dataValues.floor,
      available: deletedSpace.dataValues.available,
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

const updateParkingSpaceByUser = async (req, res) => {
  try {
    let space = req.parkingSpace
    if (
      !space.dataValues.available &&
      space.dataValues.UserId !== req.auth.id
    ) {
      return res
        .status(200)
        .json({ message: "Space is already taken by another user" })
    }
    if (req.body.available) {
      space = extend(space, { available: true, UserId: null })
    } else {
      space = extend(space, { available: false, UserId: req.auth.id })
    }

    await space.save()
    return res.status(200).json({
      id: space.dataValues.id,
      number: space.dataValues.number,
      floor: space.dataValues.floor,
      available: space.dataValues.available,
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

const ListFreeSpaces = async (req, res) => {
  try {
    let spaces = await Parking.findAll({
      where: { available: true },
      attributes: ["number", "floor", "available"],
    })
    if (req.body.floor) {
      spaces = spaces.filter((space) => space.floor === req.body.floor)
    }
    return res.status(200).json(spaces)
  } catch (err) {
    return res.status(400).json(err)
  }
}

const retrieveUserSpace = async (req, res) => {
  try {
    let user = req.profile
    const hisParking = await user.getParking({
      attributes: ["number", "floor"],
    })
    return res.status(200).json(hisParking)
  } catch (err) {
    return res.status(400).json(err)
  }
}

module.exports = {
  createParkingSpace,
  listParkingSpaces,
  getParkingSpace,
  updateParkingSpace,
  removeParkingSpace,
  ListFreeSpaces,
  retrieveUserSpace,
  updateParkingSpaceByUser,
  parkingByID,
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW4iOmZhbHNlLCJpYXQiOjE2MjU0MjQ3NDZ9.vL9n8_JuvuKAEQ1C5dtQZISIp-KU5tROwXBM2zICnQc

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW4iOnRydWUsImlhdCI6MTYyNTQyMzQwOH0.EaEYIJU4lKwtUg4Q1ou9Y6SqfBSxkTcywadYyd8tH-o
