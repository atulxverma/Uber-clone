import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SocketDataContext } from "../context/SocketContext";

// Fix for Leaflet Default Icon Issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// MapUpdater Component: Map ko naye coordinates par smooth fly karwata hai
const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom(), {
      animate: true,
      duration: 1.5, // Smooth movement duration
    });
  }, [position, map]);
  return null;
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: 28.6139,
    lng: 77.209,
  });

  const { socket } = useContext(SocketDataContext);

  useEffect(() => {
    // 1. Function to get User's Current Location
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          // Console log taaki pata chale update ho raha hai
          console.log("📍 User Location Updated:", latitude, longitude);

          setCurrentPosition({
            lat: latitude,
            lng: longitude,
          });
        });
      }
    };

    // First call immediately
    updateLocation();

    // 2. Set Interval for every 10 seconds (10000 ms)
    const locationInterval = setInterval(updateLocation, 10000);

    // 3. Listen for Captain Updates (Socket overrides manual interval)
    socket.on("captain-location-update", (data) => {
      console.log("🚖 Captain Moved:", data.location);
      setCurrentPosition({
        lat: data.location.ltd,
        lng: data.location.lng,
      });
    });

    // Cleanup function (Component unmount hone par interval band karo)
    return () => {
      clearInterval(locationInterval);
      socket.off("captain-location-update");
    };
  }, [socket]);

  return (
    <MapContainer
      center={[currentPosition.lat, currentPosition.lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[currentPosition.lat, currentPosition.lng]}>
        <Popup>Location Updated!</Popup>
      </Marker>

      <MapUpdater position={[currentPosition.lat, currentPosition.lng]} />
    </MapContainer>
  );
};

export default LiveTracking;
