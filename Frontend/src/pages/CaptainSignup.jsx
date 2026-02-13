import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const submitHandler = async (e) => {
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
        capacity: Number(capacity),
        vehicleType,
      },
    };

    console.log("Sending:", captainData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/register`,
        captainData,
      );

      console.log("Response:", response.data);

      if (response.status === 201) {
        setCaptain(response.data.captain);

        localStorage.setItem("token", response.data.token);

        navigate("/captain-home");
      }
    } catch (error) {
      console.log("Backend error full:", error.response.data);
      console.log("Exact message:", error.response.data.errors?.[0]?.msg);
      console.log("Exact field:", error.response.data.errors?.[0]?.path);
    }

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
    <div className="p-7 pt-4 min-h-screen flex flex-col justify-between">
      <div>
        {/* Logo */}
        <img
          className="w-20 mb-6 -ml-2"
          src="https://static.vecteezy.com/system/resources/previews/027/127/594/original/uber-logo-uber-icon-transparent-free-png.png"
          alt="Uber Driver"
        />

        <form onSubmit={submitHandler}>
          {/* Name */}
          <h3 className="text-lg font-medium mb-2">What's your name</h3>

          <div className="flex gap-4 mb-6">
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
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-lg"
            type="email"
            placeholder="email@example.com"
          />

          {/* Password */}
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>

          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-lg"
            type="password"
            placeholder="password"
          />

          {/* Vehicle Info */}
          <h3 className="text-lg font-medium mb-2">Vehicle Info</h3>

          {/* Row 1 */}
          <div className="flex gap-4 mb-4">
            <input
              required
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-lg"
              type="text"
              placeholder="Vehicle Color"
            />

            <input
              required
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-lg"
              type="text"
              placeholder="Vehicle Plate"
            />
          </div>

          {/* Row 2 */}
          <div className="flex gap-4 mb-6">
            <input
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-lg"
              type="number"
              placeholder="Capacity"
            />

            <select
              required
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-lg"
            >
              <option value="">Vehicle Type</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          {/* Button */}
          <button className="bg-[#111] text-white mb-4 rounded px-4 py-2 w-full text-lg">
            Register as Captain
          </button>
        </form>

        {/* Login link */}
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="text-[11px] text-gray-500 text-center mt-10">
        This site is protected by reCAPTCHA and the Google Privacy Policy and
        Terms of Service apply.
      </p>
    </div>
  );
};

export default CaptainSignup;
