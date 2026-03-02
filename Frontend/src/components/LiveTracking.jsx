import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; 
import L from "leaflet";
import "leaflet-routing-machine"; 
import { SocketDataContext } from "../context/SocketContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Routing = ({ pickup, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !pickup || !destination) return;

    // Create Routing Control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickup.lat, pickup.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: false,
      show: false, 
      addWaypoints: false, 
      fitSelectedRoutes: true, 
      lineOptions: {
        styles: [{ color: "#6366f1", weight: 4 }], // Blue Line
      },
      createMarker: function () {
        return null;
      }, // Default markers hide karke hum apne custom markers use kar sakte hain (Optional)
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, pickup, destination]);

  return null;
};

const LiveTracking = ({ pickup, destination }) => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: 28.6139,
    lng: 77.209,
  });

  const { socket } = useContext(SocketDataContext);

  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({
            lat: latitude,
            lng: longitude,
          });
        });
      }
    };

    updateLocation(); 
    const locationInterval = setInterval(updateLocation, 10000);

    socket.on("captain-location-update", (data) => {
      setCurrentPosition({
        lat: data.location.ltd,
        lng: data.location.lng,
      });
    });

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
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[currentPosition.lat, currentPosition.lng]}>
        <Popup>You are here</Popup>
      </Marker>

      {pickup && destination && (
        <Routing pickup={pickup} destination={destination} />
      )}
    </MapContainer>
  );
};

export default LiveTracking;
