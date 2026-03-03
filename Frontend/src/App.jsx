import { Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import CaptainLogin from "./pages/CaptainLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper";
import CaptainLogout from "./pages/CaptainLogout";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import UserHistory from "./pages/UserHistory";
import AdminDashboard from "./pages/AdminDashboard";
import Referral from "./pages/Referral";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />

        <Route path="/user/logout" element={<UserLogout />} />

        <Route
          path="/riding"
          element={
            <UserProtectedWrapper>
              <Riding />
            </UserProtectedWrapper>
          }
        />

        <Route
          path="/captain-home"
          element={
            <CaptainProtectedWrapper>
              <CaptainHome />
            </CaptainProtectedWrapper>
          }
        />

        <Route path="/captain/logout" element={<CaptainLogout />} />

        <Route
          path="/captain-riding"
          element={
            <CaptainProtectedWrapper>
              <CaptainRiding />
            </CaptainProtectedWrapper>
          }
        />

        <Route
          path="/user/history"
          element={
            <UserProtectedWrapper>
              <UserHistory />
            </UserProtectedWrapper>
          }
        />
      </Routes>
      <Route
        path="/user/referral"
        element={
          <UserProtectedWrapper>
            <Referral />
          </UserProtectedWrapper>
        }
      />
    </div>
  );
};

export default App;
