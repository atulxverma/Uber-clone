const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userModel = require('../models/user.model');
const captainController = require('../controllers/captain.controller');


router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Vehicle plate must be at least 3 characters long'),
    body('vehicle.vehicleType').isIn(['car', 'bike', 'scooter']).withMessage('Vehicle type must be either car, bike, or scooter'),
], 
    captainController.registerCaptain
)

module.exports = router;