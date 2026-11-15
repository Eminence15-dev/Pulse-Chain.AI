
import { getTransferRecommendation } from "../utils/transferUtils";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom clinic markers
const createIcon = (status) => {
  const colors = {
    low: "#e53935",
    surplus: "#16a36a",
    normal: "#2878d0"
  };

  return L.divIcon({
    className: "clinic-marker",
    html: `<div style="
      background:${colors[status] || "#777"};
      width:22px;
      height:22px;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px #555;
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

function ClinicMap({ clinics }) {

  // Get nearest donor and predicted recipient
  const recommendation = getTransferRecommendation(clinics);

  return (
    <div className="map-container">

      <h2>Clinic Locations</h2>

      <p>
        Medicine availability across nearby clinics
      </p>

      <div className="map-legend">
        <span>🔴 Low Stock</span>
        <span>🟢 Surplus</span>
        <span>🔵 Normal</span>
      </div>

      <MapContainer
        center={[31.4504, 73.1350]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Display all clinic markers */}
        {clinics.map((clinic) => (
          <Marker
            key={clinic.id}
            position={[clinic.lat, clinic.lng]}
            icon={createIcon(clinic.status)}
          >
            <Popup>
              <h3>{clinic.name}</h3>
              <p>Village: {clinic.village}</p>
              <p>Medicine: {clinic.medicine}</p>
              <p>Stock: {clinic.stock} packs</p>
              <p>
                Daily Usage: {clinic.dailyUsage} packs
              </p>
              <strong>
                Status: {clinic.status.toUpperCase()}
              </strong>
            </Popup>
          </Marker>
        ))}

        {/* Display nearest donor transfer route */}
        {recommendation && (
          <Polyline
            positions={[
              [
                recommendation.donor.lat,
                recommendation.donor.lng
              ],
              [
                recommendation.recipient.lat,
                recommendation.recipient.lng
              ]
            ]}
            pathOptions={{
              color: "#16a36a",
              weight: 5,
              dashArray: "8 8"
            }}
          >
            <Popup>
              <h3>Nearest Donor Transfer</h3>

              <p>
                Donor: {recommendation.donor.name}
              </p>

              <p>
                Recipient: {recommendation.recipient.name}
              </p>

              <p>
                Medicine: {recommendation.donor.medicine}
              </p>

              <p>
                Transfer: {recommendation.transferAmount} Packs
              </p>

              <p>
                Distance: {recommendation.distance} km
              </p>
            </Popup>
          </Polyline>
        )}

      </MapContainer>
    </div>
  );
}

export default ClinicMap;
