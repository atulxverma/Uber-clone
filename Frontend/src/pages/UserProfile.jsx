import React, { useContext, useState, useRef } from 'react';
import { UserDataContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const { user, setUser } = useContext(UserDataContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState(user?.fullname?.firstname || '');
    const [lastName, setLastName] = useState(user?.fullname?.lastname || '');
    const [profilePic, setProfilePic] = useState(user?.profilePic || ''); 
    const [isLoading, setIsLoading] = useState(false);

        // Image ko chota (Compress) karne wala function
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    // Image ka size chota kar rahe hain (Max 500x500 pixels)
                    const MAX_WIDTH = 500;
                    const MAX_HEIGHT = 500;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    // Image ko JPEG format me 70% quality par compress karo
                    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
                    
                    // Ab ye choti image save hogi (No 413 Error!)
                    setProfilePic(compressedBase64);
                };
            };
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/users/update-profile`,
                { fullname: { firstname: firstName, lastname: lastName }, profilePic: profilePic },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.status === 200) {
                setUser(response.data); 
                setIsEditing(false);    
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
                <h1 className="text-xl font-bold">My Account</h1>
                <div className="w-10"></div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto pb-10">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center mb-6 relative">
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 text-blue-600 bg-blue-50 p-2 rounded-full font-medium text-sm flex items-center gap-1 active:scale-95">
                            <i className="ri-pencil-line"></i> Edit
                        </button>
                    )}

                    {/* Image Area */}
                    <div className="relative mb-4">
                        <div className="h-24 w-24 bg-black rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg overflow-hidden border-4 border-white">
                            {profilePic || user?.profilePic ? (
                                <img src={profilePic || user?.profilePic} alt="profile" className="h-full w-full object-cover" />
                            ) : (
                                user?.fullname?.firstname?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        {isEditing && (
                            <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-blue-600 text-white h-8 w-8 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                <i className="ri-camera-fill text-sm"></i>
                            </button>
                        )}
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                    </div>

                    {/* Edit Form / Display Info */}
                    {isEditing ? (
                        <div className="w-full mt-2 flex flex-col gap-3">
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-gray-100 w-full p-3 rounded-xl outline-none border border-gray-200 focus:border-black" placeholder="First Name" />
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-gray-100 w-full p-3 rounded-xl outline-none border border-gray-200 focus:border-black" placeholder="Last Name" />
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => {setIsEditing(false); setProfilePic(user?.profilePic || '');}} className="w-1/2 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold">Cancel</button>
                                <button onClick={handleSaveProfile} disabled={isLoading} className="w-1/2 bg-green-600 text-white py-3 rounded-xl font-bold">
                                    {isLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold capitalize text-gray-800">
                                {user?.fullname?.firstname} {user?.fullname?.lastname}
                            </h2>
                            <div className="flex items-center gap-2 mt-1 text-gray-500">
                                <i className="ri-mail-line"></i>
                                <p>{user?.email}</p>
                            </div>
                            <div className="mt-4 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                                <i className="ri-verified-badge-fill text-lg"></i> Verified Rider
                            </div>
                        </>
                    )}
                </div>

                {/* Account Options */}
                <h3 className="text-gray-500 font-bold text-xs mb-3 uppercase tracking-wider px-2">Account Options</h3>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    {user?.email === "admin@gmail.com" && (
                        <Link to="/admin/dashboard" className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl"><i className="ri-shield-user-line"></i></div>
                                <div><span className="font-bold text-gray-800 block text-lg">Admin Panel</span><span className="text-xs text-gray-500">Manage all rides</span></div>
                            </div>
                            <i className="ri-arrow-right-s-line text-gray-400 text-2xl"></i>
                        </Link>
                    )}
                    <Link to="/user/history" className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center text-2xl"><i className="ri-history-line"></i></div>
                            <div><span className="font-bold text-gray-800 block text-lg">Ride History</span><span className="text-xs text-gray-500">View past trips & fares</span></div>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400 text-2xl"></i>
                    </Link>
                </div>

                <Link to="/user/logout" className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-all shadow-sm">
                    <i className="ri-logout-box-r-line text-xl"></i> Log Out
                </Link>
            </div>
        </div>
    );
};

export default UserProfile;