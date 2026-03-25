import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const FinishRide = (props) => {
  const navigate = useNavigate();

  async function endRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        {
          rideId: props.rideData._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false);
        props.onRideEnd(); 
      }
    } catch (error) {
      console.error("Error ending ride:", error);
    }
  }

  return (
    <div>
      <h5
        onClick={() => props.setConfirmRidePopupPanel(false)}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl text-gray-500 cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-9 mt-3 ml-2">
        Finish this Ride?
      </h3>

      <div className="flex items-center justify-between p-4 mt-4 border-yellow-400 border-2 rounded-lg">
        <div className="flex items-center gap-3">
          <img
  className="h-12 w-12 rounded-full object-cover"
  src={props.rideData?.userId?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
  alt="user"
/>
          <h2 className="text-lg font-medium">
            {props.rideData?.userId?.fullname.firstname}
          </h2>
        </div>
        <h5 className="text-slg font-semibold ">2.2 KM</h5>
      </div>

      <div className="flex justify-between flex-col gap-2 items-center">
        <div className="w-full ">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.rideData?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 ">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.rideData?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.rideData?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full">
          <button
            onClick={endRide}
            className="w-full bg-green-600 text-lg flex justify-center text-white font-semibold p-3 rounded-lg"
          >
            Finish Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
