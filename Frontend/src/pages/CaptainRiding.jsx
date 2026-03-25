import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";
import LiveChat from "../components/LiveChat";
import CaptainRatingPanel from "../components/CaptainRatingPanel";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketDataContext } from "../context/SocketContext";
import axios from "axios";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  const location = useLocation();
  const rideData = location.state?.ride;

  const { captain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketDataContext);

  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const chatPanelRef = useRef(null);

  const [ratingPanelOpen, setRatingPanelOpen] = useState(false);
  const ratingPanelRef = useRef(null);
  const [distance, setDistance] = useState("");

  useEffect(() => {
    if (socket && captain?._id) {
      socket.emit("join", { userType: "captain", userId: captain._id });
    }
  }, [socket, captain]);

  useEffect(() => {
    if (rideData?.pickup && rideData?.destination) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
          params: {
            origin: rideData.pickup,
            destination: rideData.destination,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setDistance(response.data.distance.text);
        })
        .catch((err) => console.log(err));
    }
  }, [rideData]);

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, { transform: "translateY(0%)" });
    } else {
      gsap.to(finishRidePanelRef.current, { transform: "translateY(100%)" });
    }
  }, [finishRidePanel]);

  useGSAP(() => {
    if (chatPanelOpen) {
      gsap.to(chatPanelRef.current, { transform: "translateY(0%)" });
    } else {
      gsap.to(chatPanelRef.current, { transform: "translateY(100%)" });
    }
  }, [chatPanelOpen]);

  useGSAP(() => {
    if (ratingPanelOpen) {
      gsap.to(ratingPanelRef.current, { transform: "translateY(0%)" });
    } else {
      gsap.to(ratingPanelRef.current, { transform: "translateY(100%)" });
    }
  }, [ratingPanelOpen]);

  // Ye function chalega jab ride backend se complete ho jayegi
  const handleRideEnd = () => {
    setFinishRidePanel(false);
    setRatingPanelOpen(true);
  };

  return (
    <div className="h-screen relative flex flex-col justify-end overflow-hidden">
      {/* HEADER */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-full z-10">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="logo"
        />
        <Link
          to="/captain/logout"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full pointer-events-auto shadow-md"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="fixed top-0 left-0 h-screen w-screen -z-10">
        <LiveTracking />
      </div>

      {/* YELLOW BAR (HIDE HOGA JAB CHAT, FINISH YA RATING PANEL KHULEGA) */}
      {!chatPanelOpen && !finishRidePanel && !ratingPanelOpen && (
        <div className="h-1/5 p-6 bg-yellow-400 flex items-center justify-between relative z-10 shadow-lg rounded-t-3xl">
          <h5 className="p-1 text-center w-[90%] absolute top-0">
            <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
          </h5>
          <h4 className="text-xl font-semibold">Drop Location</h4>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setChatPanelOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 flex items-center justify-center rounded-xl shadow-md transition-all"
            >
              <i className="ri-chat-3-line text-xl"></i>
            </button>
            <button
              onClick={() => setFinishRidePanel(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold h-12 px-6 rounded-xl shadow-md transition-all"
            >
              Complete Ride
            </button>
          </div>
        </div>
      )}

      {/* FINISH RIDE POPUP */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-10 rounded-t-3xl shadow-2xl"
      >
        <FinishRide
          rideData={rideData}
          setConfirmRidePopupPanel={setFinishRidePanel}
          onRideEnd={handleRideEnd}
        />
      </div>

      {/* CHAT PANEL */}
      <div
        ref={chatPanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl overflow-hidden"
      >
        <LiveChat
          socket={socket}
          senderId={captain?._id}
          receiverId={rideData?.userId?._id}
          receiverType="user"
          setChatPanelOpen={setChatPanelOpen}
        />
      </div>

      {/* CAPTAIN RATING PANEL */}
      <div
        ref={ratingPanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-4 py-8 rounded-t-3xl shadow-2xl"
      >
        <CaptainRatingPanel rideData={rideData} />
      </div>
    </div>
  );
};

export default CaptainRiding;
