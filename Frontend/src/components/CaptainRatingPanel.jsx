import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainRatingPanel = (props) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const navigate = useNavigate();

  const submitHandler = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/rate`,
        { rideId: props.rideData._id, rating: rating, userType: "captain" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      navigate("/captain-home");
    } catch (error) {
      console.log(error);
      navigate("/captain-home");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-2 pb-4 border-b-2 mb-4">
        <h3 className="text-2xl font-semibold">Rate your Passenger</h3>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="h-24 w-24 bg-black text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg overflow-hidden border-4 border-gray-100 mb-2">
          {props.rideData?.userId?.profilePic ? (
            <img
              src={props.rideData.userId.profilePic}
              alt="passenger"
              className="h-full w-full object-cover"
            />
          ) : (
            props.rideData?.userId?.fullname?.firstname
              ?.charAt(0)
              .toUpperCase() || "U"
          )}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold capitalize">
            {props.rideData?.userId?.fullname?.firstname || "Passenger"}
          </h2>
          <p className="text-gray-500">How was your passenger?</p>
        </div>

        <div className="flex gap-2 my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="bg-transparent border-none outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(rating)}
            >
              <i
                className={`text-5xl transition-colors ${star <= (hover || rating) ? "ri-star-fill text-yellow-400" : "ri-star-line text-gray-300"}`}
              ></i>
            </button>
          ))}
        </div>

        <button
          onClick={submitHandler}
          disabled={rating === 0}
          className={`w-full font-semibold py-3 rounded-xl shadow-md text-lg transition-all ${rating > 0 ? "bg-black text-white active:scale-95" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default CaptainRatingPanel;
