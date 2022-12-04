import React from "react";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useHistory } from "react-router-dom";
import MarkerIcon from "./icons/MarkerIcon";
import { useState } from "react";
import { useEffect } from "react";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZ2Vla3lzcm0iLCJhIjoiY2pqOWlyYm9wMThubjNxbzVsbWZrZDFkYSJ9.qR-h7UMZRad_rFeA-GegMQ",
});

function renderMarkers(properties, history) {
  return properties.map((property) => {
    return (
      <Marker
        onClick={() => {
          history.push(`/property/${property.id}`);
        }}
        coordinates={[property.lng, property.lat]}
        anchor="bottom"
        key={`${property.lng}X${property.lat}`}
      >
        <img
          style={{ cursor: "pointer" }}
          src="https://res.cloudinary.com/geekysrm/image/upload/v1633292206/299087_marker_map_icon.png"
          alt="map marker"
        />
      </Marker>
    );
  });
}

export default function CustomMap({ properties, zoomLat, zoomLng }) {
  const history = useHistory();
  const [showMarker, setShowMarker] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowMarker(true);
    }, 5500);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <Map
        // eslint-disable-next-line react/style-prop-object
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100vh",
        }}
        center={
          properties.length > 0
            ? [77.69741899999997, 12.9591722]
            : [85.824539, 20.296059]
        }
      >
        {renderMarkers(properties, history)}
      </Map>
      {showMarker && properties.length && (
        <MarkerIcon
          mr={2}
          style={{ position: "absolute", top: "50%", right: "50%" }}
        />
      )}
    </div>
  );
}
