"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LocationMap = dynamic(
  () => import("./location-map").then((mod) => mod.LocationMap),
  { ssr: false },
);

type Props = {
  fallbackLat: number;
  fallbackLng: number;
  label: string;
};

export function LocationMapClient({ fallbackLat, fallbackLng, label }: Props) {
  const [coords, setCoords] = useState({
    lat: fallbackLat,
    lng: fallbackLng,
  });

  useEffect(() => {
    if (!label) return;

    const ctrl = new AbortController();

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(label)}&format=json&limit=1`,
      {
        headers: { "User-Agent": "thureinhtet-portfolio/3.0" },
        signal: ctrl.signal,
      },
    )
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.length > 0) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        }
      })
      .catch(() => {});

    return () => ctrl.abort();
  }, [label]);

  return (
    <LocationMap
      fallbackLat={coords.lat}
      fallbackLng={coords.lng}
      label={label}
    />
  );
}
