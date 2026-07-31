"use client";

import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const markerIcon = icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -30],
});

type Props = {
  fallbackLat: number;
  fallbackLng: number;
  label: string;
};

export function LocationMap({ fallbackLat, fallbackLng, label }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative z-0 h-32 w-full overflow-hidden rounded-md border border-muted-foreground/20 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full">
        <MapContainer
          center={[fallbackLat, fallbackLng]}
          zoom={10}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <Marker position={[fallbackLat, fallbackLng]} icon={markerIcon}>
            <Popup>{label}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
