import React, { useState } from "react";

const LocationSearchPanel = (props) => {

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelect = (location, index) => {

    // highlight selected location
    setSelectedLocation(index);

    // Call the handler from parent to set the pickup or destination
    props.handleLocationSelect(location);

  };

  return (
    <div>
      {props.suggestions && props.suggestions.length > 0 ? (
        props.suggestions.map((location, index) => (

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
              {location.description}
            </h4>

          </div>

        ))
      ) : (
        <div className="p-3 text-gray-500 text-center">
          No suggestions available
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;
