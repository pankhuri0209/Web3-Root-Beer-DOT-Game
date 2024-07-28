import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet.animatedmarker/src/AnimatedMarker";
import factory from "./icons/factory.png";
import truck from "./icons/truck.png";
import Modal from "react-modal";
import "./styles.css";

// Initialize react-modal
Modal.setAppElement("#root"); // Ensure your root element has an id of 'root'

const points = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.2],
  [51.41, 0.1],
];

const textMessages = ["Factory 1", "Factory 2", "Factory 3", "Factory 4"];

const customIcon = L.icon({
  iconUrl: factory,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const truckIcon = L.icon({
  iconUrl: truck,
  iconSize: [82, 82],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const Routing = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    let animatedMarker;
    let animatedMarkers = [];

    // Define routes for the two trucks
    const routes = [
      [points[3], points[2]], // Route for truck 1
      [points[2], points[1]], // Route for truck 1
      [points[1], points[0]], // Route for truck 2
    ];

    routes.forEach((route, index) => {
      const routingControl = L.Routing.control({
        waypoints: route.map((point) => L.latLng(point[0], point[1])),
        routeWhileDragging: false,
        createMarker: () => null, // Prevent default markers from being added
      }).addTo(map);

      routingControl.on("routesfound", function (e) {
        const routeCoordinates = e.routes[0].coordinates;
        const animatedMarker = L.animatedMarker(routeCoordinates, {
          autoStart: true,
          icon: truckIcon,
          // interval: 2000, // Adjust the speed of the truck here
        });
        animatedMarkers.push(animatedMarker);
        map.addLayer(animatedMarker);
      });
    });

    // const routingControl = L.Routing.control({
    //   waypoints: routes.map((point) => L.latLng(point[0], point[1])),
    //   routeWhileDragging: false,
    //   createMarker: () => null,
    // }).addTo(map);

    // routingControl.on("routesfound", function (e) {
    //   const route = e.routes[0];
    //   e.routes;
    //   animatedMarker = L.animatedMarker(route.coordinates, {
    //     autoStart: true,
    //     icon: truckIcon,
    //     // interval: 3000,
    //   });
    //   map.addLayer(animatedMarker);
    // });

    return () => {
      // map?.removeControl(routingControl);
      if (animatedMarkers?.length > 0) {
        animatedMarkers.forEach((marker) => map?.removeLayer(marker));
      }
    };
  }, [map]);

  return null;
};

const MapComponent = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const openModal = (index) => {
    console.log(`Opening modal for point ${index}`);
    setSelectedPoint(index);
  };

  const closeModal = () => {
    setSelectedPoint(null);
  };

  return (
    <div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {points.map((point, index) => {
          const customDivIcon = L.divIcon({
            html: `<div class="custom-div-icon">
           <img src="${factory}" class="icon" style="height: 32px;width: 32px;" />
           <span class="icon-label" style="    width: 100px;
    display: block;
    font-size: 19px;
    font-weight: 800;">${textMessages[index]}</span>
         </div>`,
            className: "",
            iconSize: [16, 16],
            iconAnchor: [16, 32],
          });
          return (
            <Marker
              key={index}
              position={point}
              icon={customDivIcon}
              eventHandlers={{
                click: () => openModal(index),
              }}
            ></Marker>
          );
        })}
        <Routing />
      </MapContainer>
      {selectedPoint !== null && (
        <Modal
          isOpen={true}
          onRequestClose={closeModal}
          contentLabel={`Details for ${textMessages[selectedPoint]}`}
          className={"modal-pop"}
        >
          <h2>{textMessages[selectedPoint]}</h2>
          <p>Details about {textMessages[selectedPoint]}</p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default MapComponent;
