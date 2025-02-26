/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../lib/useAuth";

// ✅ Register required components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressChart() {
  const { user } = useAuth(); // Get the logged-in user
  const [data, setData] = useState<any>(null); // State to store chart data
  const [loading, setLoading] = useState<boolean>(false); // State to manage loading
  const [progressData, setProgressData] = useState<any[]>([]); // State to store progress data

  useEffect(() => {
    if (!user) return; // If no user, don't fetch data

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch the user's progress data
        const response = await fetch("/api/progress", {
          method: "GET",
          headers: {
            userId: user.uid, // Send the user ID in the headers
          },
        });

        const result = await response.json();
        setProgressData(result);
        console.log(result);

        if (response.ok) {
          // Set chart data based on result
          const progressData = {
            labels: result.map(
              (item: any) => `Week ${item.createdAt.slice(5, 7)}`
            ), // Example, adjust as necessary
            datasets: [
              {
                label: "Progress Score",
                data: result.map((item: any) => item.form.prediction), // Example, adjust as necessary
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 2,
              },
            ],
          };
          setData(progressData);
        } else {
          console.error("Failed to fetch progress data:", result.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No progress data available</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-0 my-12">
      <h2 className="text-lg font-semibold mb-2">Progress Over Time</h2>
      <Line data={data} />

      {/* Show all the progress data in a table below from the DB */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Progress Data</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Sl.</th>
              <th className="border p-2 text-left">Prediction (Form)</th>
              <th className="border p-2 text-left">Confidence (Form)</th>
              <th className="border p-2 text-left">Prediction (Video)</th>
              <th className="border p-2 text-left">Confidence (Video)</th>
              <th className="border p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {progressData?.map((entry: any, index: number) => (
              <tr key={entry._id}>
                <td className="border p-2">{index + 1}.</td>
                <td className="border p-2">
                  {entry.form?.prediction || "N/A"}
                </td>
                <td className="border p-2">
                  {entry.form?.confidence || "N/A"}
                </td>
                <td className="border p-2">
                  {entry.video?.prediction || "N/A"}
                </td>
                <td className="border p-2">
                  {entry.video?.confidence || "N/A"}
                </td>
                <td className="border p-2">
                  {new Date(entry.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
