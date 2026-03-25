import { Link, useNavigate } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useRef, useState, useEffect, useContext } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SocketDataContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import LiveTracking from "../components/LiveTracking";
import axios from "axios";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketDataContext);
  const { captain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/rides/current-captain-ride`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200 && res.data) {
          navigate("/captain-riding", { state: { ride: res.data } });
        }
      })
      .catch((err) => {
        console.log("No active rides");
      });
  }, []);

  async function confirmRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
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
      
      {/* HEADER */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-full z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <img
            className="w-16"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="logo"
          />
        </div>

        <Link
          to="/captain/profile"
          className="h-12 w-12 bg-white flex items-center justify-center rounded-full pointer-events-auto shadow-lg border border-gray-100 active:scale-95 transition-all"
        >
          <i className="text-xl font-bold ri-user-3-line text-gray-800"></i>
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