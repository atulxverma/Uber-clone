import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/admin/dashboard`)
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!stats) return <div className="h-screen flex items-center justify-center">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <Link to="/home" className="text-blue-600 font-semibold hover:underline">Go to App</Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.totalUsers} icon="ri-user-line" color="bg-blue-500" />
                <StatCard title="Total Captains" value={stats.totalCaptains} icon="ri-taxi-line" color="bg-green-500" />
                <StatCard title="Total Rides" value={stats.totalRides} icon="ri-road-map-line" color="bg-purple-500" />
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon="ri-money-rupee-circle-line" color="bg-yellow-500" />
            </div>

            {/* Recent Rides Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold">Recent Rides</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-4">Ride ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Captain</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Fare</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {stats.recentRides.map((ride) => (
                                <tr key={ride._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-mono text-gray-500">{ride._id.slice(-6)}</td>
                                    <td className="p-4 font-medium">{ride.userId?.fullname?.firstname || 'N/A'}</td>
                                    <td className="p-4">{ride.captainId?.fullname?.firstname || 'Unassigned'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                            ${ride.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                              ride.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                              'bg-yellow-100 text-yellow-700'}`}>
                                            {ride.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold">₹{ride.fare}</td>
                                    <td className="p-4 text-gray-500">{new Date(ride.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
        <div className={`h-12 w-12 flex items-center justify-center rounded-full text-white ${color}`}>
            <i className={`${icon} text-xl`}></i>
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;