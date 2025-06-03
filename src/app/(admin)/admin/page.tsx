"use client";
// admin page

import { Button } from "@/components/ui/button";
import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
Chart.register(ArcElement, Tooltip, Legend);

interface Result {
  _id: string;
  userId: string;
  userEmail: string;
  autismCategory: number;
  form: {
    prediction: number;
    confidence: number;
  };
  video: {
    prediction: number | null;
    confidence: number | null;
  };
  images: Array<{
    prediction: number;
    confidence: number;
    _id: string;
  }>;
  createdAt: string;
}

const AdminPage = () => {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<
    "weekly" | "monthly" | "quarterly" | "yearly" | "custom"
  >("weekly");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const contentRef = useRef<HTMLTableElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const deleteProgress = async (userId: string) => {
    try {
      const res = await fetch("/api/progress", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        throw new Error("Failed to delete progress");
      }
      // Refresh data after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting progress:", error);
      setError("Failed to delete progress");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch results
      const resultsRes = await fetch("/api/results");
      if (!resultsRes.ok) {
        throw new Error("Failed to fetch results");
      }
      const resultsData = await resultsRes.json();
      console.log(resultsData);
      setResults(Array.isArray(resultsData) ? resultsData : []);

      // Fetch progress for each user
      const progressObj: Record<string, any> = {};
      for (const result of resultsData) {
        try {
          const progressRes = await fetch("/api/progress", {
            headers: {
              userId: result.userId,
              autismCategory: result.autismCategory.toString(),
            },
          });
          if (!progressRes.ok) {
            console.error(`Failed to fetch progress for user ${result.userId}`);
            continue;
          }
          const progressData = await progressRes.json();
          progressObj[result.userId] = progressData.progress || [];
        } catch (error) {
          console.error(
            `Error fetching progress for user ${result.userId}:`,
            error
          );
        }
      }
      setProgressMap(progressObj);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for admin token
    const adminToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="));
    if (!adminToken) {
      router.push("/login");
      return;
    }

    fetchData();
  }, [router]);

  const getCategoryText = (category: number) => {
    switch (category) {
      case 1:
        return "Low Risk";
      case 2:
        return "Moderate Risk";
      case 3:
        return "High Risk";
      default:
        return "Unknown";
    }
  };

  const getPerWeekProgress = (userId: string) => {
    const userProgressArr = progressMap[userId] || [];
    const weekArr = Array(12).fill("0/3");
    userProgressArr.forEach((weekObj: any) => {
      weekArr[weekObj.week - 1] = `${
        Array.isArray(weekObj.checkedIndexes)
          ? weekObj.checkedIndexes.length
          : 0
      }/3`;
    });
    return weekArr;
  };

  const getCurrentWeek = (userId: string) => {
    const userProgressArr = progressMap[userId] || [];
    if (!Array.isArray(userProgressArr) || userProgressArr.length === 0)
      return "None";
    return `Week ${userProgressArr[userProgressArr.length - 1].week}`;
  };

  const getTotalCompleted = (userId: string) => {
    const userProgressArr = progressMap[userId] || [];
    if (!Array.isArray(userProgressArr)) return "0/36";
    const total = userProgressArr.reduce(
      (acc: number, week: any) =>
        acc +
        (Array.isArray(week.checkedIndexes) ? week.checkedIndexes.length : 0),
      0
    );
    return `${total}/36`;
  };

  const getFilteredResults = () => {
    const now = new Date();
    const filteredResults = results.filter((result) => {
      const resultDate = new Date(result.createdAt);

      if (filterType === "custom") {
        if (!startDate || !endDate) return true;
        return resultDate >= startDate && resultDate <= endDate;
      }

      const diffTime = Math.abs(now.getTime() - resultDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filterType) {
        case "weekly":
          return diffDays <= 7;
        case "monthly":
          return diffDays <= 30;
        case "quarterly":
          return diffDays <= 90;
        case "yearly":
          return diffDays <= 365;
        default:
          return true;
      }
    });
    return filteredResults;
  };

  const handleFilterTypeChange = (
    type: "weekly" | "monthly" | "quarterly" | "yearly" | "custom"
  ) => {
    setFilterType(type);
    if (type !== "custom") {
      setStartDate(null);
      setEndDate(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold  ">Admin Dashboard</h1>
        {/* <Button
          variant={"destructive"}
          onClick={() => {
            document.cookie =
              "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push("/login");
          }}
        >
          Logout
        </Button> */}
      </div>

      <div>
        <div>
          <div className="flex justify-between items-center my-8 bg-gray-300 p-4 rounded-md">
            <div className="text-2xl font-bold">User Results & Progress</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <select
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterType}
                  onChange={(e) =>
                    handleFilterTypeChange(
                      e.target.value as
                        | "weekly"
                        | "monthly"
                        | "quarterly"
                        | "yearly"
                        | "custom"
                    )
                  }
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom Date Range</option>
                </select>
                {filterType === "custom" && (
                  <div className="flex items-center gap-2">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Start Date"
                      className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span>to</span>
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate ?? undefined}
                      placeholderText="End Date"
                      className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
              <div id="report">
                <Button onClick={() => reactToPrintFn()}>Print Report</Button>
              </div>
            </div>
          </div>
        </div>
        <div ref={contentRef}>
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border whitespace-wrap word-wrap">
                  User Email
                </th>
                <th className="px-3 py-2 border whitespace-nowrap">Category</th>
                <th className="px-3 py-2 border whitespace-nowrap">
                  Current Week
                </th>
                <th className="px-3 py-2 border whitespace-nowrap">
                  Total Completed
                </th>
                <th className="px-3 py-2 border whitespace-nowrap">
                  Per-Week Progress
                </th>
                <th className="px-3 py-2 border whitespace-nowrap">Date</th>
                <th className="px-3 py-2 border printHide">Delete Progress</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredResults().map((result) => {
                const perWeek = getPerWeekProgress(result.userId);
                return (
                  <tr key={result._id} className="even:bg-gray-50">
                    <td className="px-3 py-2 border whitespace-wrap word-wrap">
                      {result.userEmail}
                    </td>
                    <td className="px-3 py-2 border whitespace-nowrap">
                      <span
                        className={
                          result.autismCategory === 3
                            ? "bg-red-200 text-red-800 px-2 py-1 rounded"
                            : result.autismCategory === 2
                            ? "bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
                            : "bg-green-200 text-green-800 px-2 py-1 rounded"
                        }
                      >
                        {getCategoryText(result.autismCategory)}
                      </span>
                    </td>
                    <td className="px-3 py-2 border whitespace-nowrap">
                      {getCurrentWeek(result.userId)}
                    </td>
                    <td className="px-3 py-2 border whitespace-nowrap h-full align-middle">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-blue-500 h-3 rounded-full"
                            style={{
                              width: `${
                                (parseInt(getTotalCompleted(result.userId)) /
                                  36) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-center mt-1">
                          {getTotalCompleted(result.userId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 border whitespace-nowrap">
                      <div className="w-20 h-20 mx-auto">
                        <Doughnut
                          data={{
                            labels: ["Completed", "Remaining"],
                            datasets: [
                              {
                                data: [
                                  parseInt(getTotalCompleted(result.userId)),
                                  36 -
                                    parseInt(getTotalCompleted(result.userId)),
                                ],
                                backgroundColor: ["#3b82f6", "#e5e7eb"],
                                borderWidth: 1,
                              },
                            ],
                          }}
                          options={{
                            cutout: "70%",
                            plugins: {
                              legend: { display: false },
                            },
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 border whitespace-nowrap">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 border printHide">
                      <Button onClick={() => deleteProgress(result.userId)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
