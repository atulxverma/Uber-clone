import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }).catch((err) => {
            console.log("Token invalid, forcing logout...");
            localStorage.removeItem('token');
            navigate('/login');
        });
    }, [token, navigate]);

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="text-xl font-semibold">Logging out...</div>
        </div>
    );
};

export default UserLogout;