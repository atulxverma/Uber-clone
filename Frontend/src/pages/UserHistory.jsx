import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

const UserHistory = () => {
    const [rides, setRides] = useState([]);
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        axios.get(`${import.meta.env.VITE_BASE_URL}/rides/user-history`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setRides(response.data);
        })
        .catch((err) => {
            console.error("Error fetching history:", err);
        });
    }, []);

    return (
        <div className="h-screen bg-gray-100">
            {/* Header */}
            <div className="fixed p-6 top-0 flex items-center justify-between w-full bg-white shadow-sm z-10">
                <Link to="/home" className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full">
                    <i className="text-lg font-medium ri-arrow-left-line"></i>
                </Link>
                <h1 className="text-xl font-bold">My Rides</h1>
                <div className="w-10"></div> {/* Spacer for center alignment */}
            </div>

            {/* List */}
            <div className="pt-24 px-4 pb-10 space-y-4 overflow-y-auto h-full">
                {rides.length > 0 ? (
                    rides.map((ride, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h2 className="text-lg font-semibold capitalize">
                                        {ride.captainId?.fullname?.firstname} {ride.captainId?.fullname?.lastname}
                                    </h2>
                                    <p className="text-sm text-gray-500">{ride.captainId?.vehicle?.plate}</p>
                                </div>
                                <h2 className="text-lg font-bold text-green-600">₹{ride.fare}</h2>
                            </div>

                            <div className="border-t pt-3 space-y-3">
                                <div className="flex items-start gap-3">
                                    <i className="ri-map-pin-user-fill text-gray-800 mt-1"></i>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Pickup</h3>
                                        <p className="text-base font-medium">{ride.pickup}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <i className="ri-map-pin-2-fill text-gray-800 mt-1"></i>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Destination</h3>
                                        <p className="text-base font-medium">{ride.destination}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-3 text-right">
                                <span className="text-xs text-gray-400">
                                    {new Date(ride.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-20">
                        <i className="ri-road-map-line text-6xl mb-4 block"></i>
                        No rides yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHistory;