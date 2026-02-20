const Ride = require("../models/ride.model");
const mapsService = require("./maps.service");
const crypto = require("crypto");


async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const distanceTime = await mapsService.getDistanceTime(pickup, destination);

  if (
    !distanceTime ||
    !distanceTime.distance ||
    !distanceTime.duration ||
    !distanceTime.distance.value ||
    !distanceTime.duration.value
  ) {
    throw new Error("Invalid distanceTime data");
  }

  // convert units
  const distanceKm = distanceTime.distance.value / 1000;
  const durationMin = distanceTime.duration.value / 60;

  const baseFare = {
    auto: 30,
    car: 50,
    motorcycle: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    motorcycle: 8,
  };

  const perMinRate = {
    auto: 2,
    car: 3,
    motorcycle: 1.5,
  };

  const fare = {
    auto:
      baseFare.auto +
      distanceKm * perKmRate.auto +
      durationMin * perMinRate.auto,

    car:
      baseFare.car + distanceKm * perKmRate.car + durationMin * perMinRate.car,

    motorcycle:
      baseFare.motorcycle +
      distanceKm * perKmRate.motorcycle +
      durationMin * perMinRate.motorcycle,
  };

  return fare;
}

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
     }  
     return generateOtp(num);
}

module.exports.createRide = async (
  userId,
  pickup,
  destination,
  vehicleType,
) => {
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required to create a ride");
  }

  const fare = await getFare(pickup, destination);

  const newRide = new Ride({
    userId: userId,

    pickup: pickup,

    destination: destination,

    vehicleType: vehicleType,

    fare: fare[vehicleType],

    otp: getOtp(4)
  });

  return await newRide.save();
};
