import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

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
    <div className="h-screen flex flex-col">
      <div className="fixed p-6 top-0 flex items-center justify-between w-full">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-login"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full "
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* TOP MAP IMAGE */}
      <div className="h-4/5">
        <img className="h-full w-full object-cover" src="/map.png" alt="" />
      </div>

      <div
        className="h-1/5 p-6 relative bg-yellow-300 flex flex-col justify-center"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5 className="absolute top-1 left-1/2 -translate-x-1/2 cursor-pointer">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>

        <div className="flex items-center justify-between mt-4">
          <h4 className="text-xl font-semibold">4 KM away</h4>

          <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
            Complete Ride
          </button>
        </div>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-10 translate-y-full bottom-0 bg-white pt-12 pb-6 px-3 rounded-t-3xl"
      >
        <FinishRide setConfirmRidePopupPanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
