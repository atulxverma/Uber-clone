import React, { useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const PaymentPanel = (props) => {
  const { user } = useContext(UserDataContext);

  const handleOnlinePayment = async () => {
    try {
      if (!props.ride?._id) {
        alert("Ride ID is missing! Cannot start payment.");
        return;
      }

      const orderResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create-payment`,
        { rideId: props.ride._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const orderData = orderResponse.data;

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Did you add the script in index.html?");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Uber Clone",
        description: "Ride Fare Payment",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/rides/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                rideId: props.ride._id,
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (verifyRes.status === 200) {
              alert("Payment Successful!");
              props.onPaymentSuccess(); // Navigate to Rating Panel
            }
          } catch (error) {
            console.error("Verification Failed:", error.response?.data || error);
            alert("Payment Verification Failed!");
          }
        },
        prefill: {
          name: user?.fullname?.firstname + " " + user?.fullname?.lastname,
          email: user?.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response){
        console.error("Razorpay Payment Failed:", response.error);
        alert("Payment failed! Check console.");
      });

      rzp.open();

    } catch (error) {
      console.error("ERROR IN PAYMENT FLOW:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Payment init failed"}`);
    }
  };

  const handleCashPayment = () => {
    alert("Ride marked as Cash Paid!");
    props.onPaymentSuccess(); // Navigate to Rating Panel
  };

  return (
    <div>
      <h5 onClick={() => props.setPaymentPanelOpen(false)} className="p-1 text-center w-[93%] absolute top-0 cursor-pointer">
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

      <div className="flex gap-4 mt-5">
        <button
          onClick={handleOnlinePayment}
          className="w-1/2 bg-black text-white font-semibold p-3 rounded-lg text-lg hover:bg-gray-800 transition-all"
        >
          Pay Online
        </button>

        <button
          onClick={handleCashPayment}
          className="w-1/2 bg-green-600 text-white font-semibold p-3 rounded-lg text-lg hover:bg-green-700 transition-all"
        >
          Pay Cash
        </button>
      </div>
    </div>
  );
};

export default PaymentPanel;