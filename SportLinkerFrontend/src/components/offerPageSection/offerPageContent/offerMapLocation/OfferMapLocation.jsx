import Button from "../../../component-items/button/button";
import MapView from "../../../component-items/mapView/MapView";
import "./offerMapLocation.css";
import { SiGooglestreetview } from "react-icons/si";
import { TbMapPinShare } from "react-icons/tb";

const OfferMapLocation = ({ location }) => {
  const long = location.coordinates[0];
  const lat = location.coordinates[1];

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
    window.open(url, "_blank");
  };

  return (
    <div className="offer-map-location-container">
      <h3>Mapa</h3>
      <MapView long={long} lat={lat} />
      <h4>{location.displayLabel}</h4>
      <div className="map-location-btn-wrapper">
        <Button
          style="mapGoogleButton"
          Icon={<SiGooglestreetview size={28} />}
          onClick={openInGoogleMaps}
          width={100}
        >
          Otwórz w mapach Google
        </Button>
        <Button
          style="mapShareButton"
          Icon={<TbMapPinShare size={28} />}
          width={100}
        >
          Udostępnij lokalizację
        </Button>
      </div>
    </div>
  );
};

export default OfferMapLocation;
