import React, { useState } from "react";
import { Link } from "react-router-dom";

const CaptainSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
      vehicle: {
        color,
        plate,
        capacity,
        vehicleType,
      },
    };

    console.log(captainData);

    // clear fields
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setColor("");
    setPlate("");
    setCapacity("");
    setVehicleType("");
  };

  return (
    <div className="p-7 pt-4 h-screen flex flex-col justify-between">
      <div>
        {/* Same logo */}
        <img
          className="w-20 mb-2 -ml-2"
          src="https://static.vecteezy.com/system/resources/previews/027/127/594/original/uber-logo-uber-icon-transparent-free-png.png"
          alt="Uber Driver"
        />

        <form onSubmit={submitHandler}>
          {/* Name */}
          <h3 className="text-lg font-medium mb-2">What's your name</h3>

          <div className="flex gap-4 mb-7">
            <input
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-lg"
              type="text"
              placeholder="First name"
            />

            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-lg"
              type="text"
              placeholder="Last name"
            />
          </div>

          {/* Email */}
          <h3 className="text-lg font-medium mb-2">What's your email</h3>

          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 w-full text-lg"
            type="email"
            placeholder="email@example.com"
          />

          {/* Password */}
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>

          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 w-full text-lg"
            type="password"
            placeholder="password"
          />

          {/* Vehicle Info */}
          <h3 className="text-lg font-medium mb-2">Vehicle Info</h3>

          <input
            required
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="bg-[#eeeeee] mb-4 rounded px-4 py-2 w-full text-lg"
            type="text"
            placeholder="Vehicle Color"
          />

          <input
            required
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="bg-[#eeeeee] mb-4 rounded px-4 py-2 w-full text-lg"
            type="text"
            placeholder="Vehicle Plate"
          />

          <input
            required
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="bg-[#eeeeee] mb-4 rounded px-4 py-2 w-full text-lg"
            type="number"
            placeholder="Vehicle Capacity"
          />

          <select
            required
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 w-full text-lg"
          >
            <option value="">Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="auto">Auto</option>
          </select>

          {/* Same button style */}
          <button className="bg-[#111] text-white mb-3 rounded px-4 py-2 border w-full text-lg">
            Register as Captain
          </button>
        </form>

        {/* Same link style */}
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>

      <p className="text-[11px] text-gray-500 text-center mt-12 mb-4 leading-tight">
  This site is protected by reCAPTCHA and the Google Privacy Policy and
  Terms of Service apply.
</p>

    </div>
  );
};

export default CaptainSignup;
