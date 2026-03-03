import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const Referral = () => {
    const { user } = useContext(UserDataContext);

    // Simple Referral Code Generator (Name + Last 4 digits of ID)
    const referralCode = `${user?.fullname?.firstname.toUpperCase()}${user?._id.slice(-4)}`;
    
    const shareMessage = `Hey! Use my code ${referralCode} to get ₹50 off on your first Uber ride! Download the app now.`;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Invite Friends',
                text: shareMessage,
                url: window.location.origin
            }).catch(console.error);
        } else {
            // Fallback for browsers not supporting Web Share API
            window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            
            {/* Header */}
            <div className="p-5 bg-white shadow-sm flex items-center justify-between">
                <Link to="/home" className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="ri-arrow-left-line text-xl"></i>
                </Link>
                <h1 className="text-xl font-bold">Invite Friends</h1>
                <div className="w-10"></div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                
                <div className="bg-yellow-100 p-6 rounded-full mb-6">
                    <i className="ri-gift-2-fill text-6xl text-yellow-600"></i>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Give ₹50, Get ₹50</h2>
                <p className="text-gray-500 mb-8 px-4">
                    Share your code with friends. When they take their first ride, you both get ₹50 off.
                </p>

                {/* Code Box */}
                <div className="bg-white border border-dashed border-gray-400 p-4 rounded-xl w-full max-w-xs mb-8 relative">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Your Code</p>
                    <h3 className="text-3xl font-black text-gray-800 tracking-wider">{referralCode}</h3>
                </div>

                {/* Share Button */}
                <button 
                    onClick={handleShare}
                    className="w-full max-w-xs bg-black text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                    <i className="ri-share-forward-line text-xl"></i> Share Code
                </button>

            </div>
        </div>
    );
};

export default Referral;