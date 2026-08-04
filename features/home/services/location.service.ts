import { unstable_cache } from "next/cache";

type Coordinates = {
  lat: number;
  lng: number;
};

const FALLBACK_LAT = 16.8661;
const FALLBACK_LNG = 96.1951;
const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

export const getResidenceCoordinates = unstable_cache(
  async (label: string): Promise<Coordinates> => {
    if (!label) {
      return {
        lat: FALLBACK_LAT,
        lng: FALLBACK_LNG,
      };
    }

    try {
      const response = await fetch(
        `${NOMINATIM_SEARCH_URL}?q=${encodeURIComponent(label)}&format=json&limit=1`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "thureinhtet-portfolio",
          },
        },
      );

      if (!response.ok) {
        return {
          lat: FALLBACK_LAT,
          lng: FALLBACK_LNG,
        };
      }

      const data: Array<{ lat: string; lon: string }> = await response.json();

      if (data.length === 0) {
        return {
          lat: FALLBACK_LAT,
          lng: FALLBACK_LNG,
        };
      }

      return {
        lat: Number.parseFloat(data[0].lat),
        lng: Number.parseFloat(data[0].lon),
      };
    } catch {
      return {
        lat: FALLBACK_LAT,
        lng: FALLBACK_LNG,
      };
    }
  },
  ["home-residence-coordinates"],
  { revalidate: 60 * 60 * 24 * 7 },
);
