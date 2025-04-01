import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@react-google-maps/api";
import { MapData } from "../../apiConstants";
import { CircularProgress } from "@mui/material";

interface MapProps {
  imagePositions: MapData[];
  mapStyles?: React.CSSProperties;
}

export const ImageMap = ({ imagePositions, mapStyles }: MapProps) => {
  const [selectedImage, setSelectedImage] = useState<MapData | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOLGE_MAPS_API_KEY,
    libraries: ["geometry", "drawing"],
  });

  const options = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  };

  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (imagePositions.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      imagePositions.forEach((pos) => {
        bounds.extend(
          new window.google.maps.LatLng(
            parseFloat(pos.latitude),
            parseFloat(pos.longitude)
          )
        );
      });
      map.fitBounds(bounds);
    }
  };

  const handleMarkerClick = (image: MapData) => {
    setSelectedImage(image);
  };

  if (!isLoaded) {
    return <CircularProgress />;
  }

  return (
    <GoogleMap mapContainerStyle={mapStyles} zoom={2} onLoad={onLoad}>
      <MarkerClusterer options={options}>
        {(clusterer) => (
          <>
            {imagePositions.map((pos) => (
              <Marker
                key={pos.id}
                position={{
                  lat: parseFloat(pos.latitude),
                  lng: parseFloat(pos.longitude),
                }}
                clusterer={clusterer}
                onClick={() => handleMarkerClick(pos)}
                clickable={true}
              />
            ))}
          </>
        )}
      </MarkerClusterer>

      {selectedImage && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedImage.latitude),
            lng: parseFloat(selectedImage.longitude),
          }}
          onCloseClick={() => setSelectedImage(null)}
        >
          <div style={{ width: "200px", height: "200px", overflow: "hidden" }}>
            <img
              src={selectedImage.imageUrl}
              alt="thumbnail"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};
