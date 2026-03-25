import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CaptainRatingPanel = (props) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const navigate = useNavigate();

  const submitHandler = () => {
    alert(`You rated the passenger ${rating} stars. ⭐`);
    navigate("/captain-home"); // Rating ke baad captain wapas home pe aayega naye rides ke liye
  };

  return (
    <div>
      <div className="flex items-center justify-between px-2 pb-4 border-b-2 mb-4">
        <h3 className="text-2xl font-semibold">Rate your Passenger</h3>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="h-20 w-20 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
          <img
            className="h-full w-full object-cover"
            src="https://imgs.search.brave.com/ea4SQ6FzWEJXf3Z3m1qLcK6Fg-uzDBntP4X_EM-maZI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTYv/Nzg1LzQxOS9zbWFs/bC9oYXBweS15b3Vu/Zy1jYWItZHJpdmVy/LWEtc3VjY2Vzcy1z/dG9yeS1vbi10aGUt/dXJiYW4tc3RyZWV0/cy1waG90by5qcGVn"
            alt="passenger"
          />
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
                className={`text-5xl transition-colors ${
                  star <= (hover || rating) ? "ri-star-fill text-yellow-400" : "ri-star-line text-gray-300"
                }`}
              ></i>
            </button>
          ))}
        </div>

        <button
          onClick={submitHandler}
          disabled={rating === 0}
          className={`w-full font-semibold py-3 rounded-xl shadow-md text-lg transition-all ${
            rating > 0 ? "bg-black text-white active:scale-95" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default CaptainRatingPanel;