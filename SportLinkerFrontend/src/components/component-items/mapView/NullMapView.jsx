import "./mapView.css";

const NullMapView = () => {
  return (
    <div className="map-placeholder">
      <div className="map-placeholder-icon">🗺️</div>
      <h3>Błędny adres</h3>
      <p>
        Wybierz lokalizację ponownie, aby zobaczyć ją na interaktywnej mapie.
      </p>
    </div>
  );
};

export default NullMapView;
