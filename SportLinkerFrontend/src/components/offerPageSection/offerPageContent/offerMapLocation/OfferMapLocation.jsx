import MapView from "../../../component-items/mapView/MapView";
import "./offerMapLocation.css";

const OfferMapLocation = ({ location }) => {
  return (
    <div className="offer-map-location-container">
      <h3>Mapa</h3>
      <MapView long={location.coordinates[0]} lat={location.coordinates[1]} />
    </div>
  );
};

export default OfferMapLocation;
