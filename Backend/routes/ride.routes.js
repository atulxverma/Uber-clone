const express = require("express");
const router = express.Router();
const {body } = require("express-validator");

const authMiddleware = require("../middlewares/auth.middleware");
const rideController = require("../controllers/ride.controller");

router.post('/create', 
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Pickup location must be at least 3 characters long'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Destination location must be at least 3 characters long'),
    body('vehicleType').isIn(['auto', 'car', 'motorcycle']).withMessage('Vehicle type must be one of auto, car, or motorcycle'),
    rideController.createRide
)

module.exports = router;
