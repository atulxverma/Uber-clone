import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketDataContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PaymentPanel from "../components/PaymentPanel";
import LiveChat from "../components/LiveChat";
import { UserDataContext } from "../context/UserContext";
import RatingPanel from "../components/RatingPanel";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketDataContext);
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);

  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const chatPanelRef = useRef(null);

  const [paymentPanelOpen, setPaymentPanelOpen] = useState(false);
  const paymentPanelRef = useRef(null);
  
  const [ratingPanelOpen, setRatingPanelOpen] = useState(false);
  const ratingPanelRef = useRef(null);

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join", { userType: "user", userId: user._id });
    }
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;
    socket.on("ride-ended", () => {
      setPaymentPanelOpen(true);
    });
    return () => {
      socket.off("ride-ended");
    };
  }, [socket]);

  useGSAP(() => {
    if (paymentPanelOpen) {
      gsap.to(paymentPanelRef.current, { transform: "translateY(0%)" });
    } else {
      gsap.to(paymentPanelRef.current, { transform: "translateY(100%)" });
    }
  }, [paymentPanelOpen]);

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

  const handlePaymentSuccess = () => {
    setPaymentPanelOpen(false); 
    setRatingPanelOpen(true);  
  };

  return (
    <div className="h-screen relative flex flex-col justify-end overflow-hidden">
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-10 shadow-md"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>

      <div className="fixed top-0 left-0 h-screen w-screen -z-10">
        <LiveTracking />
      </div>

      {/* NORMAL PANEL (HIDE HOGA JAB CHAT, PAYMENT YA RATING KHULEGI) */}
      {!chatPanelOpen && !paymentPanelOpen && !ratingPanelOpen && (
        <div className="h-auto min-h-[45%] bg-white rounded-t-3xl p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-24 h-16 flex items-center overflow-visible">
              <img
                className="scale-[1.9] -ml-6"
                src="/Uber-car.png"
                alt="car"
              />
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold capitalize">
                {ride?.captainId?.fullname?.firstname +
                  " " +
                  ride?.captainId?.fullname?.lastname}
              </h2>
              <h4 className="text-xl font-bold leading-tight">
                {ride?.captainId?.vehicle?.plate}
              </h4>
              <p className="text-sm text-gray-500">Maruti Suzuki Alto</p>
            </div>
          </div>

          <div className="w-full mt-4 border-t pt-4">
            <div className="flex items-center gap-4 pb-3">
              <i className="ri-map-pin-2-fill text-xl text-gray-700"></i>
              <div>
                <h3 className="text-base font-medium">Destination</h3>
                <p className="text-sm text-gray-500">{ride?.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-2">
              <i className="ri-currency-line text-xl text-gray-700"></i>
              <div>
                <h3 className="text-base font-semibold">₹{ride?.fare}</h3>
                <p className="text-sm text-gray-500">Total Fare</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full mt-4">
            <button
              onClick={() => setChatPanelOpen(true)}
              className="w-full bg-blue-100 text-blue-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <i className="ri-chat-3-line text-xl"></i> Chat with Captain
            </button>

            <button
              onClick={() => setPaymentPanelOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 rounded-xl shadow-md"
            >
              Make a Payment
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT PANEL */}
      <div
        ref={paymentPanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-10 rounded-t-3xl shadow-2xl"
      >
        <PaymentPanel 
          ride={ride} 
          setPaymentPanelOpen={setPaymentPanelOpen} 
          onPaymentSuccess={handlePaymentSuccess} 
        />
      </div>

      {/* CHAT PANEL */}
      <div
        ref={chatPanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl overflow-hidden"
      >
        <LiveChat
          socket={socket}
          senderId={user?._id}
          receiverId={ride?.captainId?._id}
          receiverType="captain"
          setChatPanelOpen={setChatPanelOpen}
        />
      </div>

      {/* RATING PANEL */}
      <div
        ref={ratingPanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-4 py-8 rounded-t-3xl shadow-2xl"
      >
        <RatingPanel ride={ride} setRatingPanelOpen={setRatingPanelOpen} />
      </div>
    </div>
  );
};

export default Riding;