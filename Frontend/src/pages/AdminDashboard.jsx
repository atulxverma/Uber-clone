import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${import.meta.env.VITE_BASE_URL}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }, []);

    useGSAP(() => {
        if (stats) {
            gsap.from(".anim-card", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
        }
    }, [stats]);

    if (!stats) return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-black border-t-transparent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            
            {/* Header */}
            <div className="bg-yellow-300 text-black p-5 pt-8 rounded-b-3xl shadow-md sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <Link to="/home" className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-95 transition-all">
                        <i className="ri-close-line text-xl font-bold"></i>
                    </Link>
                </div>
                
                {/* Total Revenue Section */}
                <div className="mt-6 mb-2">
                    <p className="text-gray-700 text-xs font-medium uppercase">Total Earnings</p>
                    <h1 className="text-4xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</h1>
                </div>
            </div>

            <div className="p-5 pb-20">
                
                {/* Stats Grid */}
                <h3 className="text-gray-600 font-bold text-sm mb-3 uppercase tracking-wide">Overview</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <DashboardCard title="Total Users" value={stats.totalUsers} icon="ri-user-3-line" />
                    <DashboardCard title="Captains" value={stats.totalCaptains} icon="ri-steering-2-line" />
                    <DashboardCard title="Total Rides" value={stats.totalRides} icon="ri-road-map-line" />
                    <DashboardCard title="Completed" value={stats.completedRides} icon="ri-checkbox-circle-line" />
                </div>

                                {/* REVENUE CHART */}
                <h3 className="text-gray-600 font-bold text-sm mb-3 uppercase tracking-wide mt-6">Revenue Trend</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 h-64 anim-card">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { name: 'Mon', revenue: 4000 },
                            { name: 'Tue', revenue: 3000 },
                            { name: 'Wed', revenue: 2000 },
                            { name: 'Thu', revenue: 2780 },
                            { name: 'Fri', revenue: 1890 },
                            { name: 'Sat', revenue: 2390 },
                            { name: 'Sun', revenue: 3490 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} width={40} />
                            <Tooltip cursor={{stroke: '#e5e7eb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={3} fill="#facc15" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Rides List */}
                <h3 className="text-gray-600 font-bold text-sm mb-3 uppercase tracking-wide">Recent Activity</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {stats.recentRides.length > 0 ? stats.recentRides.map((ride, i) => (
                        <div key={ride._id} className="anim-card flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                            
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg text-gray-600">
                                    <i className="ri-taxi-fill"></i>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm capitalize">
                                        {ride.userId?.fullname?.firstname || 'User'}
                                    </h4>
                                    <p className="text-xs text-gray-500 w-32 truncate">
                                        {ride.destination}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <h4 className="font-bold text-gray-800 text-sm">₹{ride.fare}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase 
                                    ${ride.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                      ride.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                      'bg-yellow-100 text-yellow-700'}`}>
                                    {ride.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="p-6 text-center text-gray-400 text-sm">No recent rides.</div>
                    )}
                </div>

            </div>
        </div>
    );
};

// Simple Clean Card Component
const DashboardCard = ({ title, value, icon }) => (
    <div className="anim-card bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between h-28">
        <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <i className={`${icon} text-xl text-gray-400`}></i>
        </div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
    </div>
);

export default AdminDashboard;