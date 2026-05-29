import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { io } from "socket.io-client";

import "leaflet/dist/leaflet.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5009";

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
}

export default function CustomerMap() {
  const defaultCenter = [12.9716, 77.5946];
  const [bikePosition, setBikePosition] = useState(defaultCenter);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); 

    const socket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
      auth: { token } 
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("🔌 Connected to backend WebSocket server");
      socket.emit("join-dashboard");
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket Authentication Failure:", err.message);
      setIsConnected(false);
    });

    const handleIncomingLocation = (data) => {
      console.log("📍 Live location update caught on frontend:", data);
      if (data && data.latitude && data.longitude) {
        setBikePosition([data.latitude, data.longitude]);
      }
    };

    socket.on("ride-tracked", handleIncomingLocation);

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("ride-tracked", handleIncomingLocation);
      socket.disconnect(); 
    };
  }, []); 

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b" }}>Live Bike Tracking Dashboard</h2>
        <span style={{ color: isConnected ? "#10b981" : "#ef4444", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
          {isConnected ? "● Live Connected" : "○ Offline"}
        </span>
      </div>

      <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <MapContainer 
          center={bikePosition} 
          zoom={15} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={bikePosition}>
            <Popup>
              <strong>Rented Vehicle Stream</strong> <br /> Telemetry ping is tracking live.
            </Popup>
          </Marker>

          <RecenterMap position={bikePosition} />
        </MapContainer>
      </div>
    </div>
  );
}