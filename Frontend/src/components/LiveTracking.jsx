import React, { useState, useEffect, useContext, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { SocketDataContext } from "../context/SocketContext";

// Fix Default Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 👇 ROUTING COMPONENT (CRASH FIX ADDED)
const Routing = ({ pickup, destination }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !pickup || !destination) return;

    // Purana control hatao agar exist karta hai
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickup.lat, pickup.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "driving",
      }),
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#6366f1", weight: 4 }],
      },
      createMarker: function () {
        return null;
      },
    });

    routingControl.addTo(map);
    routingControlRef.current = routingControl;

    routingControl.on("routingerror", function (e) {
      console.warn("Routing Error:", e);
    });

    // 👇 CLEANUP FUNCTION (THE MAIN FIX)
    return () => {
      if (routingControlRef.current && map) {
        try {
          // 1. Waypoints empty karo taaki library draw karna band kare
          routingControlRef.current.getPlan().setWaypoints([]);

          // 2. Control ko map se hatao
          map.removeControl(routingControlRef.current);
        } catch (error) {
          console.warn("Routing cleanup error:", error);
        }
        routingControlRef.current = null;
      }
    };
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
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
    };

    updateLocation();

    const locationInterval = setInterval(updateLocation, 10000);

    if (socket) {
      socket.on("captain-location-update", (data) => {
        setCurrentPosition({
          lat: data.location.ltd,
          lng: data.location.lng,
        });
      });
    }

    return () => {
      clearInterval(locationInterval);
      if (socket) {
        socket.off("captain-location-update");
      }
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
