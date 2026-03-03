import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel],
  );

  return (
    <div className="h-screen relative flex flex-col justify-end">
      
      {/* HEADER */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-full z-10">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        
        {/* LOGOUT BUTTON */}
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

      {/* YELLOW BAR */}
      <div
        className="h-1/5 p-6 bg-yellow-400 flex items-center justify-between relative z-10 shadow-lg rounded-t-3xl"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5 className="p-1 text-center w-[90%] absolute top-0">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>

        <h4 className="text-xl font-semibold">4 KM away</h4>
        <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>

      {/* FINISH RIDE POPUP */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-10 rounded-t-3xl shadow-2xl"
      >
        <FinishRide
          rideData={rideData}
          setConfirmRidePopupPanel={setFinishRidePanel}
        />
      </div>
    </div>
  );
};

export default CaptainRiding;