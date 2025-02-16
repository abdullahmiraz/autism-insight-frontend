"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

export default function TherapyList() {
  interface Center {
    name: string;
    location: string;
    contact: string;
  }

  const [centers, setCenters] = useState<Center[]>([]);

  useEffect(() => {
    axios.get("/api/therapy-centers").then((res) => setCenters(res.data));
  }, []);

  return (
    <div className="space-y-4">
      {centers.map((center, index) => (
        <Card key={index} className="p-4">
          <h3 className="text-lg font-bold">{center.name}</h3>
          <p>{center.location}</p>
          <p className="text-gray-600">Contact: {center.contact}</p>
        </Card>
      ))}
    </div>
  );
}
