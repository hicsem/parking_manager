const { Booking } = require("../models")

const bookParkingSpace = async (req, res) => {
  try {
    let booking = Booking.build({
      from: req.body.from,
      to: req.body.to,
      ParkingId: req.params.parkingId,
      UserId: req.auth.id,
    })

    await booking.save()
    return res.status(200).json({
      message: `Successfully booked the parking space`,
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

const listBookings = async (req, res) => {
  try {
    let bookings = await Booking.findAll({
      where: {
        ParkingId: req.params.parkingId,
      },
      attributes: ["from", "to"],
    })
    return res.status(200).json(bookings)
  } catch (err) {
    return res.status(400).json(err)
  }
}

const bookingById = async (req, res, next, id) => {
  try {
    let booking = await Booking.findByPk(id)
    if (!booking) {
      return res.status(400).json({
        error: "Booking not found",
      })
    }
    req.booking = booking
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve the booking",
    })
  }
}

const getBooking = async (req, res) => {
  return res.json({
    id: req.booking.dataValues.id,
    from: req.booking.dataValues.from,
    to: req.booking.dataValues.to,
    ParkingId: req.booking.dataValues.ParkingId,
    UserId: req.booking.dataValues.UserId,
  })
}

const removeBooking = async (req, res) => {
  try {
    let booking = req.booking
    let deletedBooking = await booking.destroy()
    return res.status(200).json({
      id: deletedBooking.dataValues.id,
      from: deletedBooking.dataValues.from,
      to: deletedBooking.dataValues.to,
      Parking: {
        number: req.parkingSpace.dataValues.number,
        floor: req.parkingSpace.dataValues.floor,
      },
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

module.exports = {
  bookParkingSpace,
  listBookings,
  bookingById,
  getBooking,
  removeBooking,
}
