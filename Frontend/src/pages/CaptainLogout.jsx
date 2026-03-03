import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptainLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
        }).catch((err) => {
            console.log("Force Logout");
        });

        localStorage.removeItem('token');
        navigate('/captain-login');

    }, [navigate]);

    return (
        <div>Logging out...</div>
    );
};

export default CaptainLogout;