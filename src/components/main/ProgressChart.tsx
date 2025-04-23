/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../lib/useAuth";
import AutismIntervention from "./practice/AutismIntervention";
import { Button } from "../ui/button";
// import { Separator } from "../ui/separator";
import { useReactToPrint } from "react-to-print";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProgressChart() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [autismCategory, setAutismCategory] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<any[]>([]);

  const contentRef = useRef<HTMLTableElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/result", {
        method: "GET",
        headers: { userId: user?.uid || "" },
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setProgressData(result);
        setAutismCategory(result[0]?.autismCategory);

        // Set up data for the chart
        const progressData = {
          labels: result.map(
            (item: any) => `Week ${item.createdAt.slice(5, 7)}`
          ),
          datasets: [
            {
              label: "Progress Score",
              data: result.map((item: any) => item.form.prediction),
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch("/api/result", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Entry deleted successfully!");
        setProgressData(progressData.filter((entry) => entry._id !== id));
      } else {
        console.error("Failed to delete entry:", result.error);
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No progress data available</div>;

  return (
    <div className="container mx-auto p-4 my-6">
      <div className="flex-1 mt-8 lg:mt-0 flex flex-col justify-between space-y-8">
        <div ref={contentRef}>
          <h3 className="text-lg font-semibold mb-4">Detection Data</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-left">#</th>
                  <th className="border p-2 text-left">Form Data</th>
                  <th className="border p-2 text-left">Image Data</th>
                  <th className="border p-2 text-left">Video Data</th>
                  <th className="border p-2 text-left">Created At</th>
                  <th className="border p-2 text-left printHide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {progressData?.map((entry: any, index: number) => (
                  <tr key={entry._id} className="hover:bg-gray-100">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">
                      {entry.form?.prediction || "N/A"}
                      <div className="text-xs text-gray-500">
                        Confidence: {entry.form?.confidence || "N/A"}
                      </div>
                    </td>
                    <td className="border p-2">
                      {entry.image?.prediction || "N/A"}
                      <div className="text-xs text-gray-500">
                        Confidence: {entry.image?.confidence || "N/A"}
                      </div>
                    </td>
                    <td className="border p-2">
                      {entry.video?.prediction || "N/A"}
                      <div className="text-xs text-gray-500">
                        Confidence: {entry.video?.confidence || "N/A"}
                      </div>
                    </td>
                    <td className="border p-2">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className="border p-2 printHide">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDelete(entry._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 📊 Graph Section */}
          <div className="my-8">
            <h2 className="text-lg font-semibold mb-2">Progress Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData}>
                <XAxis dataKey="week" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}% Completed`} />
                <Bar dataKey="progress" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div id="report">
        <Button onClick={() => reactToPrintFn()}>Print Report</Button>
      </div>
      <div className="mt-8">
        <AutismIntervention
          autismCategory={Number(autismCategory)}
          setGraphData={setGraphData} // Pass setGraphData to AutismIntervention
        />
      </div>
    </div>
  );
}
