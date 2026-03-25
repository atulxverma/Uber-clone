import React from "react";

const RidePopUp = (props) => {
  return (
    <div>
      <h5
        onClick={() => props.setRidePopupPanel(false)}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl text-gray-500 cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-9 mt-3 ml-2">
        New Ride Available!
      </h3>

      <div className="flex items-center justify-between p-3 mt-4 bg-yellow-300 rounded-lg">
        <div className="flex items-center gap-3">
          <img
  className="h-12 w-12 rounded-full object-cover"
  src={props.ride?.userId?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
  alt="user"
/>
          <h2 className="text-lg font-medium">
            {props.ride?.userId?.fullname?.firstname +
              " " +
              props.ride?.userId?.fullname?.lastname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
          ₹{props.ride?.fare}
        </h5>
      </div>

      <div className="flex justify-between flex-col gap-2 items-center">
        <div className="w-full">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
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
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>

        <div className="flex w-full mt-5 items-center justify-between">
          <button
            onClick={() => props.setRidePopupPanel(false)}
            className="bg-gray-200 mt-1 text-gray-700 font-semibold p-3 px-10 rounded-lg"
          >
            Ignore
          </button>

          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(true);
              props.confirmRide();
            }}
            className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
