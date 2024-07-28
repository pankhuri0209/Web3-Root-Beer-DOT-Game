import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet.animatedmarker/src/AnimatedMarker";
import factory from "./icons/factory.png";

const points = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.12],
];

const customIcon = L.icon({
  iconUrl: factory, // Make sure this path is correct
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const Routing = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    let animatedMarker;

    const routingControl = L.Routing.control({
      waypoints: points.map((point) => L.latLng(point[0], point[1])),
      routeWhileDragging: true,
    }).addTo(map);

    routingControl.on("routesfound", function (e) {
      const route = e.routes[0];
      animatedMarker = L.animatedMarker(route.coordinates, {
        autoStart: true,
        interval: 1000,
        // icon: customIcon,
      });
      map.addLayer(animatedMarker);
    });

    return () => {
      map?.removeControl(routingControl);
      if (animatedMarker) {
        map?.removeControl(animatedMarker);
      }
    };
  }, [map]);

  return null;
};

const MapComponent = () => {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {points.map((point, index) => (
        <Marker key={index} position={point} icon={customIcon} />
      ))}
      <Routing />
    </MapContainer>
  );
};

export default MapComponent;
