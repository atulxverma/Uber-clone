import React from "react";
import axios from "axios";

const LookingForDriver = (props) => {
  const cancelRide = async () => {
    if (!props.ride?._id) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/cancel`,
        { rideId: props.ride._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (response.status === 200) {
        props.setVehicleFound(false);
      }
    } catch (error) {
      console.error("Error cancelling ride:", error);
    }
  };

  return (
    <div>
      <h5
        onClick={() => props.setVehicleFound(false)}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5 text-center">
        Looking for a Driver
      </h3>

      <div className="flex justify-between flex-col items-center">
        <div className="w-full h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-blue-500 w-1/3 animate-loading-bar"></div>
        </div>

        <div className="relative h-32 w-full flex items-center justify-center overflow-visible my-4">
          <img
            // 👇 DYNAMIC SCALE LOGIC HERE
            className={`h-full object-contain ${
                props.vehicleType === 'car' ? "scale-[2.5]" : 
                props.vehicleType === 'auto' ? "scale-[1.8]" : 
                "scale-[2.2]" // For Bike
            }`}
            src={
              props.vehicleType === "car"
                ? "/Uber-car.png"
                : props.vehicleType === "motorcycle" ||
                    props.vehicleType === "moto"
                  ? "/Uber-bike.png"
                  : "/Uber-auto.png"
            }
            alt="vehicle"
          />
        </div>

        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{props.fare ? props.fare[props.vehicleType] : "0"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-5">
        <button
          onClick={cancelRide}
          className="w-full bg-red-600 text-white font-semibold p-3 rounded-lg shadow-md hover:bg-red-700 transition-all"
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default LookingForDriver;