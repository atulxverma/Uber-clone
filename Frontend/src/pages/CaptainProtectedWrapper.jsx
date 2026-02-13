import { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
    }
  }, [ token ]);

  axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,                 
    },
  })
  .then((response) => {     
    if (response.status === 200) {
      setCaptain(response.data.captain);
      setIsLoading(false);
    }
    })
  .catch((error) => {
    console.log("Error fetching captain profile:", error.response?.data || error.message);
    localStorage.removeItem("token");
    navigate("/captain-login");
  });

  if(isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectedWrapper;
