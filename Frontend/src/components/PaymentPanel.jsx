import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentPanel = (props) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    // Yahan future mein Payment Gateway (Razorpay/Stripe) laga sakte ho
    // Abhi ke liye bas navigate kar rahe hain
    alert("Payment Successful!");
    navigate("/home");
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
            // Optional: Agar user panel band kare to kya ho
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Payment</h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mb-6">
        <h2 className="text-lg font-medium">Total Fare</h2>
        <h2 className="text-2xl font-bold">₹{props.ride?.fare}</h2>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.ride?.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.ride?.destination}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white font-semibold p-3 rounded-lg mt-5 text-lg"
      >
        Pay Cash
      </button>
    </div>
  );
};

export default PaymentPanel;