import { useRef, useState, useEffect, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketDataContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();

  const { socket, sendMessage } = useContext(SocketDataContext);
  const { user } = useContext(UserDataContext);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const searchPanelRef = useRef(null);
  const findTripBtnRef = useRef(null);

  useEffect(() => {
    if (socket && user?._id)
      sendMessage("join", { userType: "user", userId: user._id });
  }, [socket, user]);

  useEffect(() => {
    if (pickup.length > 2) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
          params: { input: pickup },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setPickupSuggestions(res.data));
    }
  }, [pickup]);

  useEffect(() => {
    if (destination.length > 2) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
          params: { input: destination },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setDestinationSuggestions(res.data));
    }
  }, [destination]);

  socket?.on("ride-confirmed", (data) => {
    setWaitingForDriver(true);
    setVehicleFound(false);
    setRide(data);
  });
  socket?.on("ride-started", (data) => {
    setWaitingForDriver(false);
    navigate("/riding", { state: { ride: data } });
  });

  const submitHandler = (e) => e.preventDefault();

  const handleLocationSelect = (loc) => {
    if (activeField === "pickup") {
      setPickup(loc.description);
    } else {
      setDestination(loc.description);
    }
  };

  const handleVehicleSelect = (type) => setSelectedVehicle(type);

  async function findTrip() {
    if (!pickup || !destination) return;
    setVehiclePanelOpen(true);
    setPanelOpen(false);

    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
      {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    setFare(res.data);
    setPickupCoords(res.data.pickupCoords); 
    setDestCoords(res.data.destCoords);
  }

  async function createRide() {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      { pickup, destination, vehicleType },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    setConfirmRidePanel(false);
    setVehicleFound(true);
  }


  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, { height: "70%", padding: 24, opacity: 1 });
      gsap.to(panelCloseRef.current, { opacity: 1 });
      gsap.to(findTripBtnRef.current, {
        display: "block",
        opacity: 1,
        duration: 0.3,
      });
    } else {
      gsap.to(panelRef.current, { height: "0%", padding: 0, opacity: 0 });
      gsap.to(panelCloseRef.current, { opacity: 0 });
      gsap.to(findTripBtnRef.current, {
        display: "none",
        opacity: 0,
        duration: 0.1,
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanelOpen) {
      gsap.to(searchPanelRef.current, {
        transform: "translateY(-150%)",
        opacity: 0,
        display: "none",
      });
    } else {
      gsap.to(searchPanelRef.current, {
        transform: "translateY(0%)",
        opacity: 1,
        display: "block",
      });
    }
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanelOpen ? "translateY(0%)" : "translateY(120%)",
    });
  }, [vehiclePanelOpen]);
  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? "translateY(0%)" : "translateY(120%)",
    });
  }, [vehicleFound]);
  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? "translateY(0%)" : "translateY(120%)",
    });
  }, [confirmRidePanel]);
  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? "translateY(0%)" : "translateY(120%)",
    });
  }, [waitingForDriver]);

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5 z-20"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />

      <div className="h-screen w-screen fixed top-0 left-0 -z-10">
        <LiveTracking pickup={pickupCoords} destination={destCoords} />
      </div>

      <div className="absolute top-0 w-full z-20 h-full flex flex-col pointer-events-none">

        <div
          className={`flex flex-col h-full ${panelOpen ? "justify-start" : "justify-end"}`}
        >
          <div
            ref={searchPanelRef}
            className="h-fit p-6 bg-white relative pointer-events-auto shadow-md transition-all ease-in-out rounded-t-3xl"
          >
            <h5
              ref={panelCloseRef}
              onClick={() => setPanelOpen(false)}
              className="absolute opacity-0 text-2xl top-6 right-6 cursor-pointer"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>

            <h4 className="text-2xl font-semibold">Find a trip</h4>

            <form onSubmit={submitHandler} className="relative">
              <div className="line absolute h-16 w-1 top-[35%] left-8 bg-gray-700 rounded-full"></div>

              <input
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField("pickup");
                }}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
                type="text"
                placeholder="Add a pick-up location"
              />

              <input
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField("destination");
                }}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
                type="text"
                placeholder="Enter your destination"
              />
            </form>

            <div ref={findTripBtnRef} className="hidden opacity-0 mt-4">
              <button
                onClick={findTrip}
                disabled={!pickup || !destination}
                className={`px-4 py-2 rounded-lg w-full ${pickup && destination ? "bg-black text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Find Trip
              </button>
            </div>
          </div>

          <div
            ref={panelRef}
            className="bg-white h-0 pointer-events-auto overflow-hidden"
          >
            <LocationSearchPanel
              suggestions={
                activeField === "pickup"
                  ? pickupSuggestions
                  : destinationSuggestions
              }
              activeField={activeField}
              handleLocationSelect={handleLocationSelect}
            />
          </div>
        </div>
      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white pt-12 pb-6 px-3 rounded-t-3xl shadow-2xl"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={handleVehicleSelect}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white pt-12 pb-6 px-3 rounded-t-3xl shadow-2xl"
      >
        <ConfirmRide
          pickup={pickup}
          destination={destination}
          createRide={createRide}
          fare={fare}
          vehicleType={vehicleType}
          confirmRidePanel={confirmRidePanel}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white pt-12 pb-6 px-3 rounded-t-3xl shadow-2xl"
      >
        <LookingForDriver
          pickup={pickup}
          destination={destination}
          createRide={createRide}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-50 bottom-0 bg-white pt-12 pb-6 px-3 rounded-t-3xl shadow-2xl"
      >
        <WaitingForDriver
          ride={ride}
          waitingForDriver={waitingForDriver}
          setWaitingForDriver={setWaitingForDriver}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>
    </div>
  );
};

export default Home;
