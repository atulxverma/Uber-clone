import React from "react";

const WaitingForDriver = (props) => {
  return (
    <div>
      <h5
        onClick={() => props.setWaitingForDriver(false)}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl text-gray-500 cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <div className="flex items-center justify-between">
        <img className="h-24 scale-[1.5] -m-6" src="/Uber-car.png" alt="car" />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">
            {/* 👇 FIX: captainId use kiya */}
            {props.ride?.captainId?.fullname?.firstname}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {/* 👇 FIX: Accessing plate inside vehicle object */}
            {props.ride?.captainId?.vehicle?.plate}
          </h4>
          <p className="text-sm text-gray-600">
             {/* 👇 FIX: Vehicle type */}
             Maruti Suzuki Alto
          </p>
          <h1 className="text-lg font-semibold">{props.ride?.otp}</h1>
        </div>
      </div>

      <div className="flex justify-between flex-col gap-2 items-center">
        <div className="w-full ">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 ">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;