"use client";

import { Line } from "react-chartjs-2";

export default function ProgressChart() {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Progress Score",
        data: [20, 40, 60, 80],
        borderColor: "blue",
        borderWidth: 2,
      },
    ],
  };

  return <Line data={data} />;
}
