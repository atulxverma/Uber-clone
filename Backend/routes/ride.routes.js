const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// GET FARE
router.get(
  "/get-fare",
  authMiddleware.authUser,
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  rideController.getFare,
);

// CREATE RIDE
router.post(
  "/create",
  authMiddleware.authUser,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isIn(["auto", "car", "motorcycle"])
    .withMessage("Invalid vehicle type"),
  rideController.createRide,
);

// CONFIRM RIDE
router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  rideController.confirmRide,
);

// 👇 FIXED THIS ROUTE: Changed GET to POST, query to body, and OTP length to 6
router.post(
  "/start-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  body("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  rideController.startRide,
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  rideController.endRide,
);

router.post(
  "/cancel",
  authMiddleware.authUser,
  body("rideId").isMongoId().withMessage("Invalid Ride ID"),
  rideController.cancelRide,
);


router.get('/user-history', 
    authMiddleware.authUser, 
    rideController.getUserRideHistory
);

module.exports = router;

router.post("/create-payment", authMiddleware.authUser, rideController.createOrder);
router.post("/verify-payment", authMiddleware.authUser, rideController.verifyPayment);