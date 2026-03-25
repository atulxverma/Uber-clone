const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({    
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
    },
    captainId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "captain", 
        default: null 
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
        default: "pending"
    },
    fare: {
        type: Number,
        default: 0
    },
    distance: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    },
    paymentId: {
        type: String,
        default: null
    },
    orderId: {
        type: String,
        default: null
    },
    signature: {    
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
        select : false,
        required: true
    }
        userRating: {
        type: Number,
        default: 0
    },
    captainRating: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("ride", rideSchema);