import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    };

    console.log(userData);

    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        {/* Uber Logo */}
        <img
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber"
        />

        {/* Form */}
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

          {/* Button */}
          <button className="bg-[#111] text-white mb-3 rounded px-4 py-2 w-full text-lg">
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        By proceeding, you consent to get calls, WhatsApp, or SMS messages,
        including by automated means, from Uber and its affiliates to the number
        provided.
      </p>
    </div>
  );
};

export default UserSignup;
