import React from "react";
import axios from "axios";

const LookingForDriver = (props) => {
  const cancelRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/cancel`,
        {
          rideId: props.ride?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200) {
        props.setVehicleFound(false);
        alert("Ride Cancelled");
      }
    } catch (error) {
      console.error("Error cancelling ride:", error);
    }
  };

  return (
    <div>
      <h5
        onClick={() => props.setVehicleFound(false)}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl text-gray-500 cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <div className="px-2 mt-3 mb-6">
        <h3 className="text-2xl font-semibold mb-1 flex justify-center items-center">
          Looking for a Driver
        </h3>

        {/* Gradient loading line */}
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 animate-loading rounded-full"></div>
        </div>
      </div>

      <div className="flex justify-between flex-col gap-2 items-center">
        <img className="-m-19 " src="/Uber-car.png" alt="car" />

        <div className="w-full ">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 ">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{props.fare[props.vehicleType]}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={cancelRide}
        className="w-full mt-5 bg-red-600 text-white font-semibold p-2 rounded-lg"
      >
        Cancel Ride
      </button>
    </div>
  );
};

export default LookingForDriver;
