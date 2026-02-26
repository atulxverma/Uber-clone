import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketDataContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking"; 

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    socket.on("ride-ended", () => {
      navigate("/home");
    });
    return () => {
      socket.off("ride-ended");
    };
  }, [socket, navigate]);

  return (
    <div className="h-screen flex flex-col">
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-10"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>

      <div className="h-1/2">
        <LiveTracking />
      </div>

      <div className="h-1/2 bg-white rounded-t-3xl p-5 flex flex-col justify-between shadow-lg">

        <div className="flex items-center justify-between">
          <div className="w-24 h-16 flex items-center overflow-visible">
            <img className="scale-[1.9] -ml-6" src="/Uber-car.png" alt="car" />
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

        <div className="w-full mt-4 border-t pt-2">
          <div className="flex items-center gap-4 py-3 border-b">
            <i className="ri-map-pin-2-fill text-xl text-gray-700"></i>
            <div>
              <h3 className="text-base font-medium">Destination</h3>
              <p className="text-sm text-gray-500">{ride?.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 py-3">
            <i className="ri-currency-line text-xl text-gray-700"></i>
            <div>
              <h3 className="text-base font-semibold">₹{ride?.fare}</h3>
              <p className="text-sm text-gray-500">Cash Payment</p>
            </div>
          </div>
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 rounded-xl shadow-md">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
