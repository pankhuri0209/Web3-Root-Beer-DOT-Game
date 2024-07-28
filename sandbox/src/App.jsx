import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet.animatedmarker/src/AnimatedMarker";
import factory from "./icons/factory.png";
import truck from "./icons/truck.png";
import Modal from "react-modal";
import "./styles.css";
import distributor from "./json/distributor.json";
import manufactor from "./json/manufactor.json";
import retailer from "./json/retailer.json";
import wholeseller from "./json/wholeseller.json";

// Initialize react-modal
Modal.setAppElement("#root"); // Ensure your root element has an id of 'root'

const points = [
  [51.50472, -0.93315],
  [51.5169, -0.92508],
  [51.519739, -0.954523],
  [51.51925, -0.9716892],
];

const textMessages = ["Retailer", "Wholeseller", "Distributor", "Manufacturer"];

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

const Routing = ({ jsonData }) => {
  const [weekIndex, setWeekIndex] = useState(0);
  const map = useMap();

  useEffect(() => {
    if (!map || !jsonData || weekIndex >= jsonData.manufactor.length) return;

    const weekData = {
      manufactor: jsonData.manufactor[weekIndex],
      distributor: jsonData.distributor[weekIndex],
      wholeseller: jsonData.wholeseller[weekIndex],
      retailer: jsonData.retailer[weekIndex],
    };

    const routes = [
      [points[3], points[2]], // Route for manufacturer to distributor
      [points[2], points[1]], // Route for distributor to wholesaler
      [points[1], points[0]], // Route for wholesaler to retailer
    ];

    const icons = [
      createTruckIcon(weekData.manufactor, "Distributor"),
      createTruckIcon(weekData.distributor, "Wholeseller"),
      createTruckIcon(weekData.wholeseller, "Retailer"),
    ];

    let animatedMarkers = [];

    routes.forEach((route, index) => {
      const routingControl = L.Routing.control({
        waypoints: route.map((point) => L.latLng(point[0], point[1])),
        routeWhileDragging: false,
        createMarker: () => null,
      }).addTo(map);

      routingControl.on("routesfound", (e) => {
        const routeCoordinates = e.routes[0].coordinates;
        const animatedMarker = L.animatedMarker(routeCoordinates, {
          autoStart: false,
          icon: icons[index],
        });
        animatedMarkers.push(animatedMarker);
      });
    });

    const animateTrucks = () => {
      if (animatedMarkers.length > 0) {
        map.addLayer(animatedMarkers[0]);
        animatedMarkers[0].start();

        setTimeout(() => {
          map.removeLayer(animatedMarkers[0]);
          map.addLayer(animatedMarkers[1]);
          animatedMarkers[1].start();

          setTimeout(() => {
            map.removeLayer(animatedMarkers[1]);
            map.addLayer(animatedMarkers[2]);
            animatedMarkers[2].start();

            setTimeout(() => {
              map.removeLayer(animatedMarkers[2]);
            }, 10000);
          }, 10000);
        }, 10000);
      }
    };

    setTimeout(() => {
      animateTrucks();
    }, 5000);

    const interval = setInterval(() => {
      setWeekIndex((prev) => prev + 1);
    }, 40000);

    return () => {
      clearInterval(interval);
      animatedMarkers.forEach((marker) => map.removeLayer(marker));
    };
  }, [map, weekIndex, jsonData]);

  return null;
};

const createTruckIcon = (data, type) => {
  return L.divIcon({
    html: `<div class="custom-truck-icon">
      <img src="${truck}" class="icon"/>
      <span class="icon-label">Week: ${data.Week}</span><br/>
      <span class="icon-label">Incoming Orders : ${
        data[`Incoming Orders`]
      }</span><br/>
      <span class="icon-label">Supply: ${data.Supply}</span><br/>
      <span class="icon-label">Inventory: ${data.Inventory}</span>
    </div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [16, 32],
  });
};

const MapClickLogger = () => {
  useMapEvents({
    click(e) {
      console.log(`Clicked coordinates: ${e.latlng.lat}, ${e.latlng.lng}`);
    },
  });
  return null;
};

const MapComponent = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const jsonData = { manufactor, distributor, wholeseller, retailer };

  const openModal = (index) => setSelectedPoint(index);
  const closeModal = () => setSelectedPoint(null);

  return (
    <div>
      <MapContainer
        center={[51.51515225, -0.94611055]}
        zoom={50}
        style={{ height: "800px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {points.map((point, index) => (
          <Marker
            key={index}
            position={point}
            icon={L.divIcon({
              html: `<div class="custom-div-icon">
                <img src="${factory}" class="icon" style="height: 32px;width: 32px;" />
                <span class="icon-label" style="width: 100px; display: block; font-size: 19px; font-weight: 800;">${textMessages[index]}</span>
              </div>`,
              className: "",
              iconSize: [16, 16],
              iconAnchor: [16, 32],
            })}
            eventHandlers={{
              click: () => openModal(index),
            }}
          />
        ))}
        <Routing jsonData={jsonData} />
        <MapClickLogger />
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
