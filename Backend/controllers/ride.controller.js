const rideModel = require("../models/ride.model");
const rideService = require("../services/ride.service");
const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");
const { sendMessageToSocketId } = require("../socket");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide(
      req.user._id,
      pickup,
      destination,
      vehicleType,
    );
    res.status(201).json(ride);

    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
     const allCaptains = await captainModel.find({});
    console.log("🛠️ DB Status:", allCaptains.map(c => `Status: ${c.status}, Coords: ${c.location.coordinates}`));
    const captainsInRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      500000,
    );

    console.log("📍 Pickup Coordinates:", pickupCoordinates);
console.log("🚗 Total Captains Found:", captainsInRadius.length);
captainsInRadius.map(c => console.log(`🧑‍✈️ Captain: ${c.fullname.firstname} | Status: ${c.status} | Socket: ${c.socketId}`));

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("userId");
    rideWithUser.otp = "";

    captainsInRadius.map((captain) => {
      if (captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });
  } catch (error) {
    if (!res.headersSent)
      return res.status(500).json({ message: error.message });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pickup, destination } = req.query;

    const fare = await rideService.getFare(pickup, destination);

    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
    const destinationCoordinates =
      await mapService.getAddressCoordinate(destination);

    return res.status(200).json({
      fare,
      pickupCoordinates,
      destinationCoordinates,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captainId: req.captain._id,
    });

    if (ride.userId && ride.userId.socketId) {
      sendMessageToSocketId(ride.userId.socketId, {
        event: "ride-confirmed",
        data: ride,
      });
    }
    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { rideId, otp } = req.body;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    if (ride.userId && ride.userId.socketId) {
      sendMessageToSocketId(ride.userId.socketId, {
        event: "ride-started",
        data: ride,
      });
    }

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    if (ride.userId && ride.userId.socketId) {
      sendMessageToSocketId(ride.userId.socketId, {
        event: "ride-ended",
        data: ride,
      });
    }

    return res.status(200).json(ride);
  } catch (err) {
    console.error("❌ Error in End Ride:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.cancelRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.cancelRide(rideId);

    if (ride.captainId) {
      const captain = await captainModel.findById(ride.captainId);
      if (captain && captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "ride-cancelled",
          data: ride,
        });
      }
    }

    return res.status(200).json({ message: "Ride cancelled" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getUserRideHistory = async (req, res) => {
  try {
    const rides = await rideService.getUserRideHistory(req.user._id);
    return res.status(200).json(rides);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.createOrder = async (req, res) => {
  try {
    const { rideId } = req.body;
    const ride = await rideModel.findById(rideId);

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    const options = {
      amount: Math.round(ride.fare * 100), 
      currency: "INR",
      receipt: rideId.toString(),
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      rideId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await rideModel.findByIdAndUpdate(rideId, {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
      });
      res.status(200).json({ message: "Payment Successful" });
    } else {
      res.status(400).json({ message: "Invalid Signature" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.rateRide = async (req, res) => {
  try {
    const { rideId, rating, userType } = req.body;
    
    const updateField = userType === 'user' ? { captainRating: rating } : { userRating: rating };
    
    await rideModel.findByIdAndUpdate(rideId, updateField);
    
    return res.status(200).json({ message: "Rating saved successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getCurrentRide = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const captainId = req.captain ? req.captain._id : null;

        let query = { status: { $in: ['accepted', 'ongoing'] } };
        
        if (userId) query.userId = userId;
        if (captainId) query.captainId = captainId;

        const currentRide = await rideModel.findOne(query).populate('userId').populate('captainId');

        if (currentRide) {
            return res.status(200).json(currentRide);
        } else {
            return res.status(404).json({ message: "No active ride" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
