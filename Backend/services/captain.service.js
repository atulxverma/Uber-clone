const captainModel = require('../models/captain.model');
const rideModel = require('../models/ride.model');


module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        },
        location: {
            type: 'Point',
            coordinates: [0, 0]
        }
    });

    return captain;
};


module.exports.getCaptainStats = async (captainId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysRides = await rideModel.find({
        captainId: captainId,
        status: 'completed',
        createdAt: { $gte: today }
    });

    const todayEarnings = todaysRides.reduce((acc, ride) => acc + ride.fare, 0);

    const totalRidesCount = await rideModel.countDocuments({
        captainId: captainId,
        status: 'completed'
    });

    return { todayEarnings, todayRidesCount: todaysRides.length, totalRidesCount };
};