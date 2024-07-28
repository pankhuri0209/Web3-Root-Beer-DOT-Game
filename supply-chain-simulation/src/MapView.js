import React from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = () => {
  // Example polyline coordinates
  const polyline = [
    [37.7749, -122.4194], // San Francisco
    [34.0522, -118.2437], // Los Angeles
    [36.1699, -115.1398], // Las Vegas
  ];

  return (
    <MapContainer
      center={[37.7749, -122.4194]} // Center the map at San Francisco
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={polyline} color="blue" />
    </MapContainer>
  );
};

export default MapView;
