const axios = require("axios");
const captainModel = require("../models/captain.model"); // Ensure ye import ho

// ---------------- GET COORDINATES ----------------
module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GEOCODE_API_KEY;

    if (!address) throw new Error("Address required");

    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (!response.data || response.data.length === 0) {
            throw new Error("Address not found");
        }
        const location = response.data[0];
        return {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon),
        };
    } catch (error) {
        console.error("Geocoding Error:", error.message);
        throw error; // Error throw karna zaroori hai taaki controller catch kare
    }
};

// ---------------- GET DISTANCE & TIME ----------------
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination required");
    }

    const originCoord = await module.exports.getAddressCoordinate(origin);
    const destCoord = await module.exports.getAddressCoordinate(destination);

    const url = `http://router.project-osrm.org/route/v1/driving/${originCoord.lng},${originCoord.lat};${destCoord.lng},${destCoord.lat}?overview=false`;

    try {
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
    } catch (err) {
        console.error("OSRM Error:", err.message);
        throw err;
    }
};

// ---------------- GET SUGGESTIONS ----------------
module.exports.getSuggestions = async (input) => {
    if (!input) throw new Error("Input required");
    const apiKey = process.env.GEOCODE_API_KEY;
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(input)}&api_key=${apiKey}`;
    try {
        const response = await axios.get(url);
        return (response.data || []).slice(0, 5).map((location) => ({
            description: location.display_name,
            lat: location.lat,
            lng: location.lon,
        }));
    } catch (err) {
        console.error("Suggestion Error:", err.message);
        return [];
    }
};

// ==========================================================
//  IMPORTANT FIX: BYPASSING GEO-SPATIAL QUERY
// ==========================================================
module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
    
    // Asal GeoSpatial Query (Commented out kyunki Index nahi hai)
    /*
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [lng, lat], radius / 6371.1 ]
            }
        }
    });
    */

    // 👇 NEW TEMPORARY LOGIC:
    // Hum sirf un captains ko dhoond rahe hain jinke paas location hai aur socketId hai (Online hain)
    // Radius check hata diya hai taaki 500 Error na aaye.
    
    console.log("⚠️ Using Fallback: Fetching ALL online captains (Ignoring Radius)");
    
    const captains = await captainModel.find({
        // Jinki location set ho
        location: { $exists: true },
        // Aur jo abhi connected hon
        socketId: { $exists: true, $ne: null } 
    });

    return captains;
};