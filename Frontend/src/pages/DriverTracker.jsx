import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
import { io } from "socket.io-client";
import api from "../api/axios"; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5009"; 

export default function DriverTracker() {
  const location = useLocation(); 
  const [isTracking, setIsTracking] = useState(false);
  const [coords, setCoords] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isSimulated, setIsSimulated] = useState(false);
  
  // 🌟 Grab passed state from MyBookings navigation fallback to fallback tag
  const [bikeId, setBikeId] = useState(location.state?.bikeId || "production_test_node"); 

  const geoWatcherRef = useRef(null);
  const socketRef = useRef(null); 

  // Auto-resolve ongoing vehicle context if testing page standalone
  useEffect(() => {
    if (location.state?.bikeId) return; 

    const fetchActiveVehicleContext = async () => {
      try {
        const res = await api.get("/bookings");
        const now = new Date();
        const activeTrip = res.data.find(b => new Date(b.startTime) <= now && new Date(b.endTime) >= now);
        
        if (activeTrip && activeTrip.bikeId) {
          setBikeId(activeTrip.bikeId._id || activeTrip.bikeId);
        }
      } catch (err) {
        console.error("Error auto-resolving vehicle context:", err);
      }
    };
    fetchActiveVehicleContext();
  }, [location.state]);

  const toggleTracking = () => {
    if (!navigator.geolocation) {
      alert("GPS features are not accessible on this device.");
      return;
    }

    if (isTracking) {
      if (geoWatcherRef.current !== null) {
        navigator.geolocation.clearWatch(geoWatcherRef.current);
        geoWatcherRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsTracking(false);
      setCoords(null);
      setIsSimulated(false);
      return;
    }

    const token = localStorage.getItem("token");
    socketRef.current = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
      auth: { token }
    });

    setIsTracking(true);
    setIsSimulated(false);

    geoWatcherRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        setLastUpdated(new Date().toLocaleTimeString());
        setIsSimulated(false);

        if (socketRef.current) {
          socketRef.current.emit("send-location", {
            bikeId,
            latitude,
            longitude,
          });
        }
      },
      (error) => {
        console.error("GPS Failure:", error);
        
        if (error.code === 3 || error.code === 1) { 
          setIsSimulated(true);
          
          const mockLat = 12.9716 + (Math.random() - 0.5) * 0.005;
          const mockLng = 77.5946 + (Math.random() - 0.5) * 0.005;
          
          setCoords({ latitude: mockLat, longitude: mockLng });
          setLastUpdated(new Date().toLocaleTimeString());

          if (socketRef.current) {
            socketRef.current.emit("send-location", {
              bikeId,
              latitude: mockLat,
              longitude: mockLng,
            });
          }
          return;
        }

        alert("Location lookup failed. Verify browser privacy permission settings.");
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true, 
        maximumAge: 0,            
        timeout: 8000             
      }
    );
  };

  useEffect(() => {
    return () => {
      if (geoWatcherRef.current !== null) {
        navigator.geolocation.clearWatch(geoWatcherRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h3>Device Location Transmitter</h3>
      <p style={{ color: "#64748b" }}>Target Transmission ID Node: <code>{bikeId || "Resolving..."}</code></p>
      
      <div style={{ margin: "25px 0" }}>
        <button
          onClick={toggleTracking}
          style={{
            padding: "18px 36px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "30px",
            border: "none",
            color: "white",
            backgroundColor: isTracking ? "#ef4444" : "#3b82f6",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          {isTracking ? "🔴 Disconnect (Stop Stream)" : "🏁 Go Live (Start Stream)"}
        </button>
      </div>

      {coords && (
        <div style={{ background: "#f8fafc", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", display: "inline-block" }}>
          <strong>Streaming Status:</strong> <br />
          <code>Lat: {coords.latitude.toFixed(5)} | Lng: {coords.longitude.toFixed(5)}</code>
        </div>
      )}

      {isTracking && (
        <div style={{ 
          maxWidth: "400px", 
          margin: "30px auto 0 auto", 
          padding: "20px", 
          background: isSimulated ? "#fef3c7" : "#dcfce7", 
          border: isSimulated ? "1px solid #fde68a" : "1px solid #bbf7d0",
          borderRadius: "12px", 
          textAlign: "left",
          color: isSimulated ? "#92400e" : "#166534"
        }}>
          <h4 style={{ margin: "0 0 10px 0" }}>
            {isSimulated ? "⚠️ Running Simulation Mode" : "🛰️ Running Real GPS Hardware"}
          </h4>
          <p style={{ margin: "5px 0" }}><b>Latitude:</b> {coords ? coords.latitude : "Searching..."}</p>
          <p style={{ margin: "5px 0" }}><b>Longitude:</b> {coords ? coords.longitude : "Searching..."}</p>
          <p style={{ margin: "5px 0", fontSize: "13px", opacity: 0.8 }}><b>Last Loop Execution:</b> {lastUpdated || "Never"}</p>
          <hr style={{ borderColor: "rgba(0,0,0,0.1)", margin: "10px 0" }} />
          <span style={{ fontSize: "12px" }}>
            {isSimulated 
              ? "Hardware timeout or indoor setting fallback triggered. Simulating shifts..." 
              : "Live pipeline running. Walk outside to watch the coordinate coordinates shift map tracking targets."}
          </span>
        </div>
      )}
    </div>
  );
}