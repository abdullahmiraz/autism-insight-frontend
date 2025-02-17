'use client';
import { useState } from 'react';
import axios from 'axios';

export default function DetectPage() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<{ message: string } | null>(null);

  const handleSubmit = async () => {
    const response = await axios.post('/api/detect', { symptoms });
    setResult(response.data);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-3">Symptom Detection</h2>
      <textarea className="w-full p-2 border" onChange={(e) => setSymptoms(e.target.value)} />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 mt-2">Analyze</button>
      {result && <p className="mt-4">{result.message}</p>}
    </div>
  );
}
