import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainLogout = () => {

  const navigate = useNavigate();

  const logout = async () => {

    const token = localStorage.getItem("token");

    await axios.get(
      `${import.meta.env.VITE_BASE_URL}/captain/logout`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    localStorage.removeItem("token");

    navigate("/captain-login");

  };

  logout();

  return <div>Logging out...</div>;

};

export default CaptainLogout;
