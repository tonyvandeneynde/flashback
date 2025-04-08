import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  MarkerClusterer,
  InfoWindow,
} from "@react-google-maps/api";
import { MapData } from "../../apiConstants";
import { CircularProgress } from "@mui/material";
import { ClusterCarousel } from "./ClusterCarousel";

interface MapProps {
  imagePositions: MapData[];
  mapStyles?: React.CSSProperties;
}

export const ImageMap = ({ imagePositions, mapStyles }: MapProps) => {
  const [selectedImage, setSelectedImage] = useState<MapData | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<any | null>(null);
  const [clusterImages, setClusterImages] = useState<MapData[]>([]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOLGE_MAPS_API_KEY,
    libraries: [],
  });
  const mapRef = useRef<google.maps.Map | null>(null);

  const options = {
    zoomOnClick: false,
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  };

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

  useEffect(() => {
    if (!mapRef.current) return;

    onLoad(mapRef.current);
  }, [imagePositions]);

  const handleMarkerClick = (image: MapData) => {
    setSelectedImage(image);
    setSelectedCluster(null);
  };

  const handleClusterClick = (cluster: any) => {
    const markers = cluster.getMarkers();
    const images = markers
      .reduce((acc: MapData[], marker: any) => {
        const position = marker.getPosition();
        const imagesOnPosition = imagePositions.filter(
          (pos) =>
            parseFloat(pos.latitude) === position.lat() &&
            parseFloat(pos.longitude) === position.lng() &&
            !acc.some((img) => img.id === pos.id)
        );
        return acc.concat(imagesOnPosition);
      }, [])
      .filter(
        (image: MapData | undefined): image is MapData => image !== undefined
      );

    if (images.length > 0) {
      setClusterImages(images);
      setSelectedImage(images[0]);
      setSelectedCluster(cluster);
    }
  };

  if (!isLoaded) {
    return <CircularProgress />;
  }

  const handleClose = () => {
    setSelectedImage(null);
    setSelectedCluster(null);
    setClusterImages([]);
  };

  return (
    <>
      <GoogleMap mapContainerStyle={mapStyles} zoom={2} onLoad={onLoad}>
        <MarkerClusterer options={options} onClick={handleClusterClick}>
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
            onCloseClick={handleClose}
          >
            <div style={{ width: "300px" }}>
              {selectedCluster ? (
                <ClusterCarousel clusterImages={clusterImages} />
              ) : (
                <img
                  src={selectedImage.imageUrl}
                  alt="thumbnail"
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
};
