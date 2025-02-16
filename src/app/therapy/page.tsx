'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TherapyPage() {
  interface Center {
    name: string;
    location: string;
    contact: string;
  }

  const [centers, setCenters] = useState<Center[]>([]);

  useEffect(() => {
    axios.get('/api/therapy-centers').then(res => setCenters(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Therapy Centers</h2>
      {centers.map((center, index) => (
        <div key={index} className="border p-3 mt-2">
          <h3 className="text-lg font-bold">{center.name}</h3>
          <p>{center.location}</p>
          <p>Contact: {center.contact}</p>
        </div>
      ))}
    </div>
  );
}
