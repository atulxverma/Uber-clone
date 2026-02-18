const axios = require("axios");

module.exports.getAddressCoordinate = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "uber-clone-app",
    },
  });

  if (response.data.length > 0) {
    return {
      lat: parseFloat(response.data[0].lat),
      lng: parseFloat(response.data[0].lon),
    };
  } else {
    throw new Error("Address not found");
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  const originCoord = await module.exports.getAddressCoordinate(origin);
  const destCoord = await module.exports.getAddressCoordinate(destination);

  const url = `https://router.project-osrm.org/route/v1/driving/${originCoord.lng},${originCoord.lat};${destCoord.lng},${destCoord.lat}?overview=false`;

  const response = await axios.get(url);

  if (response.data.routes.length > 0) {
    const route = response.data.routes[0];

    const distanceMeters = route.distance;
    const durationSeconds = route.duration;

    const distanceKm = (distanceMeters / 1000).toFixed(2);

    const days = Math.floor(durationSeconds / 86400);
    const hours = Math.floor((durationSeconds % 86400) / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);

    let durationText = "";

    if (days > 0) durationText += `${days} day `;
    if (hours > 0) durationText += `${hours} hr `;
    if (minutes > 0) durationText += `${minutes} min`;

    return {
      distance: `${distanceKm} km`,
      duration: durationText.trim(),

      distanceValue: distanceMeters,
      durationValue: durationSeconds,
    };
  } else {
    throw new Error("Route not found");
  }
};

module.exports.getSuggestions = async (input) => {

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&addressdetails=1&limit=5`;

    const response = await axios.get(url, {
        headers: { "User-Agent": "uber-clone" }
    });

    const places = response.data.map(place => ({
        type: "place",
        name: place.display_name,
        lat: place.lat,
        lng: place.lon
    }));

    // add custom suggestions
    const custom = [
        {
            type: "nearby",
            name: `Restaurants near ${input}`
        },
        {
            type: "nearby",
            name: `Hospitals near ${input}`
        },
        {
            type: "nearby",
            name: `Metro stations near ${input}`
        }
    ];

    return [...places, ...custom];
};

