import "./mapView.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({
  long,
  lat,
  markerText,
  mapHeight = `500px`,
  initialZoomMap = 14,
}) => {
  const position = [lat, long];

  function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, initialZoomMap);
    return null;
  }

  return (
    <div className="map-view-container" style={{ height: mapHeight }}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={position} />
        <Marker position={position}>
          <Popup>{markerText}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
