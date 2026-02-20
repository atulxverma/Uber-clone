const axios = require("axios");

module.exports.getAddressCoordinate = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

  const response = await axios.get(url);

  if (response.data.length === 0) {
    throw new Error("Address not found");
  }

  return {
    lat: parseFloat(response.data[0].lat),
    lng: parseFloat(response.data[0].lon),
  };
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination required");
  }

  const originCoord = await module.exports.getAddressCoordinate(origin);

  const destCoord = await module.exports.getAddressCoordinate(destination);

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${originCoord.lng},${originCoord.lat};` +
    `${destCoord.lng},${destCoord.lat}` +
    `?overview=false`;

  const response = await axios.get(url);

  if (!response.data.routes || response.data.routes.length === 0) {
    throw new Error("Route not found");
  }

  const route = response.data.routes[0];

  return {
    distance: {
      text: (route.distance / 1000).toFixed(2) + " km",

      value: route.distance,
    },

    duration: {
      text: Math.round(route.duration / 60) + " mins",

      value: route.duration,
    },
  };
};
