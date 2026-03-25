import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    todayRidesCount: 0,
    totalRidesCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };
    fetchStats();
  }, []); 

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <img
  className="h-10 w-10 rounded-full object-cover"
  src={captain?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
  alt="captain"
/>
          <h4 className="text-lg font-medium capitalize">
            {captain.fullname.firstname + " " + captain.fullname.lastname}
          </h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">₹{stats.todayEarnings}</h4>
          <p className="text-sm text-gray-600">Earned Today</p>
        </div>
      </div>

      <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">{stats.totalRidesCount}</h5> 
          <p className="text-sm text-gray-600">Total Rides</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
          <h5 className="text-lg font-medium">{stats.todayRidesCount}</h5> 
          <p className="text-sm text-gray-600">Today's Rides</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;