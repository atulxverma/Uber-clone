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
        New Ride available for you!
      </h3>

      <div className="flex items-center justify-between p-3 mt-4 bg-yellow-300 rounded-lg">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://imgs.search.brave.com/ea4SQ6FzWEJXf3Z3m1qLcK6Fg-uzDBntP4X_EM-maZI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTYv/Nzg1LzQxOS9zbWFs/bC9oYXBweS15b3Vu/Zy1jYWItZHJpdmVy/LWEtc3VjY2Vzcy1z/dG9yeS1vbi10aGUt/dXJiYW4tc3RyZWV0/cy1waG90by5qcGVn"
            alt=""
          />
          <h2 className="text-lg font-medium">Harsh Patel</h2>
        </div>
        <h5 className="text-slg font-semibold ">2.2 KM</h5>
      </div>

      <div className="flex justify-between flex-col gap-2 items-center">
        {/* <img className="-m-19 " src="/Uber-car.png" alt="car" /> */}

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

        <div className="flex w-full mt-5 items-center justify-between">

            <button
          onClick={() => props.setRidePopupPanel(false)}
          className=" bg-gray-200 mt-1 text-gray-700 font-semibold p-3 px-10 rounded-lg"
        >
          Ignore
        </button>


            <button
          onClick={() => {
            props.setConfirmRidePopupPanel(true);
          }}
          className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg"
        >
          Accept
        </button>

        
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
