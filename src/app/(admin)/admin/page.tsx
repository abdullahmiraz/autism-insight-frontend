'use client'
// admin page

import React, { useState, useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
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

interface Progress {
    _id: string;
    userId: string;
    autismCategory: number;
    progress: Array<{
        week: number;
        checkedIndexes: number[];
        _id: string;
    }>;
}

const AdminPage = () => {
    const [results, setResults] = useState<Result[]>([]);
    const [progressMap, setProgressMap] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const contentRef = useRef<HTMLTableElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });



    const deleteProgress = async (userId: string) => {
        const res = await fetch("/api/progress", {
            method: "DELETE",
            body: JSON.stringify({ userId })
        });
        const data = await res.json();
        console.log(data);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const resultsRes = await fetch("/api/results");
                const resultsData = await resultsRes.json();
                setResults(resultsData);

                // Fetch progress for each user one by one
                const progressObj: Record<string, any> = {};
                for (const result of resultsData) {
                    const progressRes = await fetch("/api/progress", {
                        headers: {
                            userId: result.userId,
                            autismCategory: (result.autismCategory.toString())
                        }
                    });
                    const progressData = await progressRes.json();
                    progressObj[result.userId] = progressData.progress || [];
                }
                setProgressMap(progressObj);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
            weekArr[weekObj.week - 1] = `${Array.isArray(weekObj.checkedIndexes) ? weekObj.checkedIndexes.length : 0}/3`;
        });
        return weekArr;
    };

    const getCurrentWeek = (userId: string) => {
        const userProgressArr = progressMap[userId] || [];
        if (!Array.isArray(userProgressArr) || userProgressArr.length === 0) return "None";
        return `Week ${userProgressArr[userProgressArr.length - 1].week}`;
    };

    const getTotalCompleted = (userId: string) => {
        const userProgressArr = progressMap[userId] || [];
        if (!Array.isArray(userProgressArr)) return "0/36";
        const total = userProgressArr.reduce((acc: number, week: any) => acc + (Array.isArray(week.checkedIndexes) ? week.checkedIndexes.length : 0), 0);
        return `${total}/36`;
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div>
                <div>
                    <div className="flex justify-between items-center my-8 bg-gray-300 p-4 rounded-md">
                        <div className="text-2xl font-bold">
                            User Results & Progress
                        </div>
                        <div id="report">
                            <Button onClick={() => reactToPrintFn()}>Print Report</Button>
                        </div>
                    </div>
                </div>
                <div ref={contentRef}>
                    <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 border whitespace-wrap word-wrap">User Email</th>
                                <th className="px-3 py-2 border whitespace-nowrap">Category</th>
                                <th className="px-3 py-2 border whitespace-nowrap">Current Week</th>
                                <th className="px-3 py-2 border whitespace-nowrap">Total Completed</th>
                                <th className="px-3 py-2 border whitespace-nowrap">Per-Week Progress</th>
                                <th className="px-3 py-2 border whitespace-nowrap">Date</th>
                                <th className="px-3 py-2 border printHide">Delete Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result) => {
                                const perWeek = getPerWeekProgress(result.userId);
                                return (
                                    <tr key={result._id} className="even:bg-gray-50">
                                        <td className="px-3 py-2 border whitespace-wrap word-wrap">{result.userEmail}</td>
                                        <td className="px-3 py-2 border whitespace-nowrap">
                                            <span className={
                                                result.autismCategory === 3 ? "bg-red-200 text-red-800 px-2 py-1 rounded"
                                                    : result.autismCategory === 2 ? "bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
                                                        : "bg-green-200 text-green-800 px-2 py-1 rounded"
                                            }>
                                                {getCategoryText(result.autismCategory)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 border whitespace-nowrap">{getCurrentWeek(result.userId)}</td>
                                        <td className="px-3 py-2 border whitespace-nowrap h-full align-middle">
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className="bg-blue-500 h-3 rounded-full"
                                                        style={{
                                                            width: `${(parseInt(getTotalCompleted(result.userId)) / 36) * 100}%`
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
                                                                    36 - parseInt(getTotalCompleted(result.userId))
                                                                ],
                                                                backgroundColor: ["#3b82f6", "#e5e7eb"],
                                                                borderWidth: 1
                                                            }
                                                        ]
                                                    }}
                                                    options={{
                                                        cutout: "70%",
                                                        plugins: {
                                                            legend: { display: false }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 border whitespace-nowrap">{new Date(result.createdAt).toLocaleDateString()}</td>
                                        <td className="px-3 py-2 border printHide">
                                            <Button onClick={() => deleteProgress(result.userId)}>Delete</Button>
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

