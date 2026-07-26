"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Fix default marker icon issue with bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function FlyToLocation({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 10, { duration: 1.5 });
  }, [map, coords]);
  return null;
}

export function LocationMap({
  fallbackLat,
  fallbackLng,
  label,
}: {
  fallbackLat: number;
  fallbackLng: number;
  label?: string;
}) {
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords([fallbackLat, fallbackLng]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setCoords([fallbackLat, fallbackLng]);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 },
    );
  }, [fallbackLat, fallbackLng]);

  if (!coords) return null;

  return (
    <div className="relative h-40 w-full rounded-md overflow-hidden border border-muted-foreground/20">
      <MapContainer
        center={coords}
        zoom={10}
        zoomControl={false}
        attributionControl={false}
        // placeholder="loading"
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <FlyToLocation coords={coords} />
        <Marker position={coords}>{label && <Popup>{label}</Popup>}</Marker>
      </MapContainer>
    </div>
  );
}
