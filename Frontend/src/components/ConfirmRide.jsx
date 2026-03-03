import React from "react";

const ConfirmRide = (props) => {
  return (
    <div>
      <h5
        onClick={() => props.setConfirmRidePanel(false)}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl text-gray-500 cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5 text-center">
        Confirm Your Ride
      </h3>

      <div className="flex justify-between flex-col items-center">
        
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

        <div className="w-full mt-2">
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

        <button
          onClick={() => {
            props.setVehicleFound(true);
            props.setConfirmRidePanel(false);
            props.createRide();
          }}
          className="w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg shadow-md hover:bg-green-700 transition-all"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;