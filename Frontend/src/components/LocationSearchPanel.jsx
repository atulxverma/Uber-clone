import React, { useState } from "react";

const LocationSearchPanel = (props) => {

  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    "24B , Sector 12, Noida",
    "Sector 62, Noida",
    "Connaught Place, Delhi",
    "Cyber City, Gurgaon"
  ];

  const handleSelect = (location, index) => {

    // highlight selected location
    setSelectedLocation(index);

    // open vehicle panel (THIS is important)
    props.setVehiclePanel(true);
    props.setPanelOpen(false);

  };

  return (
    <div>

      {locations.map((location, index) => (

        <div
          key={index}
          onClick={() => handleSelect(location, index)}
          className={`flex items-center border-2 p-3 rounded-xl justify-start gap-2 my-2 cursor-pointer transition-all
          
          ${
            selectedLocation === index
              ? "border-black bg-gray-100"
              : "border-gray-200 bg-white"
          }
          
          `}
        >

          <h2 className="bg-[#eee] h-10 w-10 flex items-center justify-center rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>

          <h4 className="font-medium">
            {location}
          </h4>

        </div>

      ))}

    </div>
  );
};

export default LocationSearchPanel;
