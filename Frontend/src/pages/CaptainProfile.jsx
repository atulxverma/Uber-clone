import React, { useContext, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainProfile = () => {
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const navigate = useNavigate();

    // Edit Profile States
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState(captain?.fullname?.firstname || '');
    const [lastName, setLastName] = useState(captain?.fullname?.lastname || '');
    const [vehiclePlate, setVehiclePlate] = useState(captain?.vehicle?.plate || '');
    const [vehicleColor, setVehicleColor] = useState(captain?.vehicle?.color || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(captain?.status === 'active');
    const [toggleLoading, setToggleLoading] = useState(false);

    const handleStatusToggle = async () => {
        setToggleLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/captains/toggle-status`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            if (response.status === 200) {
                setIsOnline(response.data.status === 'active');
                // Optional: Update global context too
                setCaptain({...captain, status: response.data.status});
            }
        } catch (error) {
            alert("Could not change status");
        }
        setToggleLoading(false);
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/captains/update-profile`,
                { 
                    fullname: { firstname: firstName, lastname: lastName },
                    vehicle: { plate: vehiclePlate, color: vehicleColor }
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.status === 200) {
                setCaptain(response.data); // Update Context instantly
                setIsEditing(false);       // Close edit mode
            }
        } catch (error) {
            alert("Failed to update profile.");
            console.error(error);
        }
        setIsLoading(false);
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white p-6 pb-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all">
                    <i className="text-xl font-medium ri-arrow-left-line"></i>
                </button>
                <h1 className="text-xl font-bold">Captain Hub</h1>
                <div className="w-10"></div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto pb-10">
                
                {/* Profile Info & Edit Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center mb-6 relative">
                    
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 text-blue-600 bg-blue-50 p-2 rounded-full font-medium text-sm flex items-center gap-1 active:scale-95">
                            <i className="ri-pencil-line"></i> Edit
                        </button>
                    )}

                    <div className="h-24 w-24 bg-yellow-400 rounded-full mb-4 flex items-center justify-center text-4xl font-bold text-gray-800 shadow-lg border-4 border-white">
                        {captain?.fullname?.firstname?.charAt(0).toUpperCase() || 'C'}
                    </div>

                    {isEditing ? (
                        <div className="w-full mt-2 flex flex-col gap-3">
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-gray-100 p-3 rounded-xl outline-none focus:border-black" placeholder="First Name" />
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-gray-100 p-3 rounded-xl outline-none focus:border-black" placeholder="Last Name" />
                            <input type="text" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} className="bg-gray-100 p-3 rounded-xl outline-none focus:border-black uppercase" placeholder="Vehicle Plate (e.g. DL-1C-AA-1234)" />
                            
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => setIsEditing(false)} className="w-1/2 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold">Cancel</button>
                                <button onClick={handleSaveProfile} disabled={isLoading} className="w-1/2 bg-green-600 text-white py-3 rounded-xl font-bold">
                                    {isLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold capitalize text-gray-800">
                                {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                            </h2>
                            <div className="flex items-center justify-center gap-3 mt-2 text-sm text-gray-600 font-medium">
                                <span className="bg-gray-100 px-3 py-1 rounded-md uppercase">{captain?.vehicle?.plate}</span>
                                <span>•</span>
                                <span className="capitalize">{captain?.vehicle?.color} {captain?.vehicle?.vehicleType}</span>
                            </div>
                            
                            <div className="mt-4 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                                <i className="ri-shield-check-fill text-lg"></i> Authorized Partner
                            </div>
                        </>
                    )}
                </div>

                                {/* ONLINE/OFFLINE TOGGLE CARD */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Current Status</h3>
                        <p className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-500'}`}>
                            {isOnline ? 'You are Online & taking rides' : 'You are Offline'}
                        </p>
                    </div>
                    
                    {/* The Switch UI */}
                    <button 
                        onClick={handleStatusToggle} 
                        disabled={toggleLoading}
                        className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-gray-300'} ${toggleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isOnline ? 'translate-x-8' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                {/* Dashboard Options */}
                <h3 className="text-gray-500 font-bold text-xs mb-3 uppercase tracking-wider px-2">Work Dashboard</h3>
                
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-all cursor-pointer" onClick={() => alert("Earnings module coming soon!")}>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl">
                                <i className="ri-money-rupee-circle-line"></i>
                            </div>
                            <div>
                                <span className="font-bold text-gray-800 block text-lg">My Earnings</span>
                                <span className="text-xs text-gray-500">Track daily & weekly payouts</span>
                            </div>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400 text-2xl"></i>
                    </div>

                    <div className="flex items-center justify-between p-4 active:bg-gray-50 transition-all cursor-pointer" onClick={() => alert("History coming soon!")}>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-2xl">
                                <i className="ri-route-line"></i>
                            </div>
                            <div>
                                <span className="font-bold text-gray-800 block text-lg">Trip History</span>
                                <span className="text-xs text-gray-500">View all completed rides</span>
                            </div>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400 text-2xl"></i>
                    </div>
                </div>

                {/* Logout Action */}
                <Link to="/captain/logout" className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-all shadow-sm">
                    <i className="ri-logout-box-r-line text-xl"></i>
                    Go Offline & Log Out
                </Link>
            </div>
        </div>
    );
};

export default CaptainProfile;