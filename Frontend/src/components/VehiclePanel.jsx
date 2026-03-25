import React, { useState, useEffect } from "react";

const VehiclePanel = (props) => {
  const { selectedVehicle, setSelectedVehicle } = props;

  // Random ETA generate kar rahe hain taaki hardcoded na lage
  const [etas, setEtas] = useState({ car: 2, motorcycle: 3, auto: 2 });

  useEffect(() => {
    setEtas({
      car: Math.floor(Math.random() * 4) + 2, // 2 to 5 mins
      motorcycle: Math.floor(Math.random() * 3) + 1, // 1 to 3 mins
      auto: Math.floor(Math.random() * 3) + 2, // 2 to 4 mins
    });
  }, [props.fare]);

  return (
    <div>
      <h5
        onClick={() => props.setVehiclePanelOpen(false)}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl text-gray-500 cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Choose a vehicle</h3>

      {/* CAR */}
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
          props.selectVehicle("car");
          setSelectedVehicle("car");
        }}
        className={`flex cursor-pointer rounded-xl w-full items-center mb-3 justify-between p-3 transition-all ${selectedVehicle === "car" ? "border-2 border-black bg-gray-100" : "border border-gray-300 bg-gray-100"}`}
      >
        <img
          src="/Uber-car.png"
          className="h-16 w-16 object-contain scale-[1.8]"
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            UberGo <i className="ri-user-3-fill"></i>4
          </h4>
          <h5 className="text-xs text-green-700 font-medium">
            {etas.car} mins away
          </h5>
          <p className="text-gray-600 text-xs">Affordable, compact rides</p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.car}</h2>
      </div>

      {/* MOTORCYCLE */}
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
          props.selectVehicle("motorcycle");
          setSelectedVehicle("motorcycle");
        }}
        className={`flex cursor-pointer rounded-xl w-full items-center mb-3 justify-between p-3 transition-all ${selectedVehicle === "motorcycle" ? "border-2 border-black bg-gray-100" : "border border-gray-300 bg-gray-100"}`}
      >
        <img
          src="/Uber-bike.png"
          className="h-16 w-16 object-contain scale-[1.8]"
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            Moto <i className="ri-user-3-fill"></i>1
          </h4>
          <h5 className="text-xs text-green-700 font-medium">
            {etas.motorcycle} mins away
          </h5>
          <p className="text-gray-600 text-xs">Fastest to beat traffic</p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.motorcycle}</h2>
      </div>

      {/* AUTO */}
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
          props.selectVehicle("auto");
          setSelectedVehicle("auto");
        }}
        className={`flex cursor-pointer rounded-xl w-full items-center mb-3 justify-between p-3 transition-all ${selectedVehicle === "auto" ? "border-2 border-black bg-gray-100" : "border border-gray-300 bg-gray-100"}`}
      >
        <img
          src="/Uber-auto.png"
          className="h-16 w-16 object-contain scale-[1.8]"
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            UberAuto <i className="ri-user-3-fill"></i>3
          </h4>
          <h5 className="text-xs text-green-700 font-medium">
            {etas.auto} mins away
          </h5>
          <p className="text-gray-600 text-xs">No bargaining, auto rides</p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.auto}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
