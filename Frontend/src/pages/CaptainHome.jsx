import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useRef, useState, useEffect, useContext } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SocketDataContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import LiveTracking from "../components/LiveTracking";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketDataContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!socket || !captain?._id) return;
    socket.emit("join", { userId: captain._id, userType: "captain" });

    const updateLocation = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("update-location-captain", {
          userId: captain._id,
          location: {
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      });
    };
    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();
    return () => clearInterval(locationInterval);
  }, [socket, captain?._id]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new-ride", (data) => {
      setRide(data);
      setRidePopupPanel(true);
    });
    return () => {
      socket.off("new-ride");
    };
  }, [socket]);

  async function confirmRide() {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rideId: ride._id }),
      },
    );

    if (response.ok) {
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    }
  }

  useGSAP(() => {
    gsap.to(ridePopupPanelRef.current, {
      transform: ridePopupPanel ? "translateY(0%)" : "translateY(100%)",
    });
  }, [ridePopupPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopupPanelRef.current, {
      transform: confirmRidePopupPanel ? "translateY(0%)" : "translateY(100%)",
    });
  }, [confirmRidePopupPanel]);

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="fixed p-6 top-0 flex items-center justify-between w-full z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <img
            className="w-16"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="logo"
          />
        </div>
        <Link
          to="/captain-login"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full pointer-events-auto shadow-md"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="fixed top-0 left-0 h-screen w-screen -z-10">
        <LiveTracking />
      </div>

      <div className="h-2/5 p-6 bg-white absolute bottom-0 w-full z-10 rounded-t-3xl shadow-lg">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white pt-12 pb-6 px-3 rounded-t-3xl shadow-2xl"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full z-50 bottom-0 h-screen translate-y-full bg-white pt-12 pb-6 px-3 rounded-t-3xl shadow-2xl"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
