"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("./location-map").then((mod) => mod.LocationMap),
  { ssr: false },
);

type Props = {
  fallbackLat: number;
  fallbackLng: number;
  label: string;
};

export function LocationMapClient(props: Props) {
  return <LocationMap {...props} />;
}
