import React from "react";

const LookingForDriver = (props) => {
  return (
    <div>
      <h5
        onClick={() => props.setVehicleFound(false)}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl text-gray-500 cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <div className="px-2 mt-3 mb-6">
        <h3 className="text-2xl font-semibold mb-1 flex justify-center items-center">Looking for a Driver</h3>

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
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Ahemdabad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 ">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Ahemdabad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹193.20</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
