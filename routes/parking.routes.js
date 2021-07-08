const express = require("express")
const parkingCtrl = require("../controllers/parking.controller")
const userCtrl = require("../controllers/user.controller")
const authCtrl = require("../controllers/auth.controller")

const router = express.Router()

router
  .route("/api/parking")
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAdminRights,
    parkingCtrl.createParkingSpace
  )
  .get(
    authCtrl.requireSignin,
    parkingCtrl.updateParkingSpacesAvailability,
    parkingCtrl.listParkingSpaces
  )

router
  .route("/api/parking/:parkingId")
  .get(
    authCtrl.requireSignin,
    parkingCtrl.updateParkingSpacesAvailability,
    parkingCtrl.getParkingSpace
  )
  .put(
    authCtrl.requireSignin,
    authCtrl.hasAdminRights,
    parkingCtrl.updateParkingSpace
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAdminRights,
    parkingCtrl.removeParkingSpace
  )

router
  .route("/api/availableparkingspaces")
  .get(
    authCtrl.requireSignin,
    parkingCtrl.updateParkingSpacesAvailability,
    parkingCtrl.ListAvailableSpaces
  )

router
  .route("/api/myparkingspace/:userId")
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    parkingCtrl.retrieveUserSpace
  )

router.param("userId", userCtrl.userByID)
router.param("parkingId", parkingCtrl.parkingByID)

module.exports = router
