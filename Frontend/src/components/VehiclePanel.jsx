import React from "react";

const VehiclePanel = (props) => {
  const { selectedVehicle, setSelectedVehicle } = props;
  return (
    <div>
      {/* CLOSE ARROW */}
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
          setSelectedVehicle("car");
        }}
        className={`flex cursor-pointer rounded-xl w-full items-center mb-3 justify-between p-3 transition-all
    ${
      selectedVehicle === "car"
        ? "border-2 border-black bg-gray-100"
        : "border border-gray-300 bg-gray-100"
    }`}
      >
        <img
          src="/Uber-car.png"
          className="h-16 w-16 object-contain scale-[1.8]"
        />

        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            UberGo <i className="ri-user-3-fill"></i>4
          </h4>
          <h5 className="text-xs">2 mins away</h5>
          <p className="text-gray-600 text-xs">Affordable, compact rides</p>
        </div>

        <h2 className="text-lg font-semibold">₹193.20</h2>
      </div>

      {/* BIKE */}
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
          setSelectedVehicle("bike");
        }}
        className={`flex cursor-pointer rounded-xl w-full items-center mb-3 justify-between p-3 transition-all
    ${
      selectedVehicle === "bike"
        ? "border-2 border-black bg-gray-100"
        : "border border-gray-300 bg-gray-100"
    }`}
      >
        <img
          src="/Uber-bike.png"
          className="h-16 w-16 object-contain scale-[1.8]"
        />

        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            Moto <i className="ri-user-3-fill"></i>1
          </h4>
          <h5 className="text-xs">3 mins away</h5>
          <p className="text-gray-600 text-xs">Affordable, motorcycle rides</p>
        </div>

        <h2 className="text-lg font-semibold">₹65.00</h2>
      </div>

      {/* AUTO */}
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
          setSelectedVehicle("auto");
        }}
        className={`flex cursor-pointer rounded-xl w-full items-center mb-3 justify-between p-3 transition-all
    ${
      selectedVehicle === "auto"
        ? "border-2 border-black bg-gray-100"
        : "border border-gray-300 bg-gray-100"
    }`}
      >
        <img
          src="/Uber-auto.png"
          className="h-16 w-16 object-contain scale-[1.8]"
        />

        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            UberAuto <i className="ri-user-3-fill"></i>3
          </h4>
          <h5 className="text-xs">2 mins away</h5>
          <p className="text-gray-600 text-xs">Affordable, auto rides</p>
        </div>

        <h2 className="text-lg font-semibold">₹118.21</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
