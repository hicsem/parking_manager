const { Parking, Booking } = require("../models")
const { Op } = require("sequelize")
const extend = require("lodash/extend")

const createParkingSpace = async (req, res) => {
  try {
    let space = Parking.build({
      number: req.body.number,
      floor: req.body.floor,
    })
    await space.save()
    return res.status(200).json({
      message: `Successfully added the parking space number :${space.number} on floor :${space.floor}`,
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

const updateParkingSpacesAvailability = async (req, res, next) => {
  const now = new Date()
  // const now = "2021-07-08T02:30:00.000Z"
  try {
    let bookedSpaces = await Booking.findAll({
      where: {
        from: { [Op.lt]: now },
        to: { [Op.gt]: now },
      },
    })
    const bookedSpacesIds = bookedSpaces.map(
      (space) => space.dataValues.ParkingId
    )

    let spaces = await Parking.findAll({
      attributes: ["id", "number", "floor", "available"],
    })

    for (i = 0; i < spaces.length; i++) {
      if (bookedSpacesIds.includes(spaces[i].id)) {
        spaces[i].available = false
        await spaces[i].save()
      } else {
        spaces[i].available = true
        await spaces[i].save()
      }
    }
    spaces = spaces.map((space) => {
      return {
        number: space.number,
        floor: space.floor,
        available: space.available,
      }
    })
    req.allParkingSpaces = spaces
    next()
  } catch (err) {
    return res.status(400).json(err)
  }
}

const listParkingSpaces = async (req, res) => {
  return res.status(200).json(req.allParkingSpaces)
}

const parkingByID = async (req, res, next, id) => {
  try {
    await updateParkingSpacesAvailability(req, res, next)
    let space = await Parking.findByPk(id)
    if (!space) {
      return res.status(400).json({
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
    if (!req.body.number || !req.body.floor) {
      return res
        .status(400)
        .json("You need to provide both the parking space number and floor")
    }
    space = extend(space, { number: req.body.number, floor: req.body.floor })
    await space.save()
    return res.status(200).json({
      id: space.dataValues.id,
      number: space.dataValues.number,
      floor: space.dataValues.floor,
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
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

const ListAvailableSpaces = async (req, res) => {
  let availablespaces = req.allParkingSpaces.filter(
    (space) => space.available === true
  )
  return res.status(200).json(availablespaces)
}

const retrieveUserSpace = async (req, res) => {
  const now = new Date()
  // now = "2021-07-08T02:30:00.000Z"
  try {
    let userSpace = await Booking.findOne({
      where: {
        UserId: req.params.userId,
        from: { [Op.lt]: now },
        to: { [Op.gt]: now },
      },
    })

    if (!userSpace) {
      return res
        .status(400)
        .json({ message: "this user doesn't have a parking space" })
    }

    let parkingSpace = await Parking.findByPk(userSpace.dataValues.ParkingId)
    return res.status(200).json({
      number: parkingSpace.dataValues.number,
      floor: parkingSpace.dataValues.floor,
    })
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
  ListAvailableSpaces,
  retrieveUserSpace,
  parkingByID,
  updateParkingSpacesAvailability,
}
