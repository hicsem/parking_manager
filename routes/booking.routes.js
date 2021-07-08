const express = require("express")
const parkingCtrl = require("../controllers/parking.controller")
const userCtrl = require("../controllers/user.controller")
const authCtrl = require("../controllers/auth.controller")
const bookingCtrl = require("../controllers/booking.controller")

const router = express.Router()

router
  .route("/api/parking/:parkingId/bookings")
  .get(authCtrl.requireSignin, bookingCtrl.listBookings)
  .post(authCtrl.requireSignin, bookingCtrl.bookParkingSpace)

router
  .route("/api/parking/bookings/:bookingId")
  .get(authCtrl.requireSignin, bookingCtrl.getBooking)
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    bookingCtrl.removeBooking
  )

router.param("userId", userCtrl.userByID)
router.param("parkingId", parkingCtrl.parkingByID)
router.param("bookingId", bookingCtrl.bookingById)

module.exports = router
