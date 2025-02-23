/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
import dynamic from "next/dynamic";
import { Icon } from "leaflet"; // Add this import at the top

import "leaflet/dist/leaflet.css";

// Simplified dynamic imports
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
import { useMap } from "react-leaflet";

interface Center {
  name: string;
  location: string;
  coordinates: [number, number];
}

function MapAutoScroller({
  coordinates,
}: {
  coordinates: [number, number] | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, 14); // Fly to the new coordinates
    }
  }, [coordinates, map]);
  return null;
}

export default function AutismCenters() {
  const [lat, setLat] = useState<number>(23.777176); // Default latitude (Dhaka)
  const [lon, setLon] = useState<number>(90.369804); // Default longitude (Dhaka)
  const [query, setQuery] = useState<string>("autism care");
  const [centers, setCenters] = useState<Center[]>([]);
  const [firstCenter, setFirstCenter] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  // const [defaultIcon, setDefaultIcon] = useState<Icon | null>(null);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setDefaultIcon(
  //       new Icon({
  //         iconUrl:
  //           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  //         iconSize: [25, 41],
  //         iconAnchor: [12, 41],
  //       })
  //     );
  //   }
  // }, []);

  const dummyCenters = useMemo<Center[]>(
    () => [
      {
        name: "Autism Care Shyamoli",
        location: "Shyamoli, Dhaka",
        coordinates: [23.7758, 90.3655],
      },
      {
        name: "Hope Autism Center",
        location: "Dhanmondi, Dhaka",
        coordinates: [23.7465, 90.376],
      },
      {
        name: "Peace Autism Care",
        location: "Mirpur, Dhaka",
        coordinates: [23.8041, 90.3668],
      },
    ],
    []
  );

  useEffect(() => {
    setCenters(dummyCenters);
  }, []); // Remove dummyCenters from dependency array since it's now memoized

  const fetchCenters = async () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&bounded=1&viewbox=${lon - 0.3},${lat + 0.3},${lon + 0.3},${lat - 0.3}`;

    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "AutismCenterFinder/1.0" },
      });
      const data = await response.json();
      const results = data.map((item: any) => ({
        name: item.display_name,
        location: item.display_name,
        coordinates: [parseFloat(item.lat), parseFloat(item.lon)] as [
          number,
          number
        ],
      }));

      setCenters(results);
      if (results.length > 0) {
        setFirstCenter(results[0].coordinates);
      }
    } catch (error) {
      console.error("Failed to fetch centers", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
          setUserLocation([latitude, longitude]);
          setFirstCenter([latitude, longitude]); // Set initial center to user location
        },
        (error) => {
          alert("Geolocation error: " + error.message); // Handle geolocation error
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">
        Find Autism Therapy Centers Worldwide
      </h1>

      <Button onClick={getCurrentLocation}>Use My Location</Button>

      <div className="flex space-x-4">
        <Input
          placeholder="Latitude"
          type="number"
          value={lat}
          onChange={(e) => setLat(parseFloat(e.target.value))}
          disabled={!!userLocation} // Disable input after geolocation
        />
        <Input
          placeholder="Longitude"
          type="number"
          value={lon}
          onChange={(e) => setLon(parseFloat(e.target.value))}
          disabled={!!userLocation} // Disable input after geolocation
        />
        <Input
          placeholder="Search query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={fetchCenters}>Search</Button>
      </div>

      <MapContainer
        center={[lat, lon]}
        zoom={12}
        style={{ height: "400px", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && <MapAutoScroller coordinates={userLocation} />}
        {firstCenter && <MapAutoScroller coordinates={firstCenter} />}
        {centers.map((center, index) => (
          <Marker
            key={index}
            position={center.coordinates}
            // icon={defaultIcon || undefined}
          >
            <Popup>
              <h2 className="font-semibold">{center.name}</h2>
              <p>Location: {center.location}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {centers.length > 0 ? (
        <div className="overflow-x-auto">
          <h2 className="text-lg font-bold mt-6">
            Search Results for &quot;{query}&quot;
          </h2>
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Coordinates</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{center.name}</td>
                  <td className="border px-4 py-2">{center.location}</td>
                  <td className="border px-4 py-2">
                    {center.coordinates[0]}, {center.coordinates[1]}
                  </td>
                  <td className="border px-4 py-2">
                    <Button
                      onClick={() => {
                        setFirstCenter(center.coordinates);
                      }}
                    >
                      View Location
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No centers found worldwide for &quot;{query}&quot;.</p>
      )}
    </div>
  );
}
