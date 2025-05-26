/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "../../../lib/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";

interface Suggestion {
  title: string;
  description: string;
}

interface WeekData {
  week: number;
  suggestions: Suggestion[];
}

interface AutismPlans {
  [key: string]: WeekData[];
}

export default function AutismIntervention({
  autismCategory,
  setGraphData,
}: {
  autismCategory: number;
  setGraphData: any;
}) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [autismPlans, setAutismPlans] = useState<AutismPlans>({});
  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/autismPlansData.json");
        const data = await response.json();
        console.log("Fetched autism plans:", data);
        setAutismPlans(data);
      } catch (error) {
        console.error("Error fetching autism plans:", error);
      }
    };
    fetchPlans();
  }, []);

  // Fetch saved progress from API
  useEffect(() => {
    async function fetchProgress() {
      try {
        if (!userId) return;

        const res = await axios.get("/api/progress", {
          headers: { userId, autismCategory },
        });
        const data = res.data.progress || [];

        // Convert DB format to checkbox state
        const newCheckedItems: Record<string, boolean> = {};
        data.forEach(
          ({
            week,
            checkedIndexes,
          }: {
            week: number;
            checkedIndexes: number[];
          }) => {
            checkedIndexes.forEach((index) => {
              newCheckedItems[`week-${week}-${index}`] = true;
            });
          }
        );

        setCheckedItems(newCheckedItems);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    }
    fetchProgress();
  }, [autismCategory, userId]);

  // Save progress to API
  const handleCheckboxChange = async (
    week: number,
    suggestionIndex: number
  ) => {
    const key = `week-${week}-${suggestionIndex}`;
    const newChecked = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newChecked);

    // Prepare data for DB
    const checkedIndexes = Object.entries(newChecked)
      .filter(([k, v]) => v && k.startsWith(`week-${week}`))
      .map(([k]) => parseInt(k.split("-")[2]));

    try {
      await axios.post("/api/progress", {
        userId,
        autismCategory,
        week,
        checkedIndexes,
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const isWeekCompleted = (week: number) => {
    const categoryKey = String(autismCategory);
    const weekData = autismPlans[categoryKey]?.[week - 1];
    if (!weekData) return false;

    return weekData.suggestions.every(
      (_: any, index: number) => checkedItems[`week-${week}-${index}`]
    );
  };

  const autismLevels: { [key: number]: { label: string; color: string } } = {
    1: { label: "Mild Autism", color: "bg-blue-500" },
    2: { label: "Moderate Autism", color: "bg-yellow-500" },
    3: { label: "Extreme Autism", color: "bg-red-500" },
  };

  // Generate Graph Data
  useEffect(() => {
    const categoryKey = String(autismCategory);
    const categoryData = autismPlans[categoryKey];

    if (categoryData) {
      const graphData = categoryData.map((weekData) => {
        const totalTasks = weekData.suggestions.length;
        const completedTasks = weekData.suggestions.filter(
          (_: any, index: number) =>
            checkedItems[`week-${weekData.week}-${index}`]
        ).length;
        return {
          week: `Week ${weekData.week}`,
          progress: (completedTasks / totalTasks) * 100,
        };
      });

      setGraphData(graphData);
    }
  }, [autismPlans, autismCategory, checkedItems, setGraphData]);

  const categoryKey = String(autismCategory);
  const categoryData = autismPlans[categoryKey];

  return (
    <div>
      <Tabs defaultValue={categoryKey} className="w-full">
        <TabsList className="flex justify-center">
          {autismLevels[autismCategory] && (
            <TabsTrigger
              value={categoryKey}
              className={`${autismLevels[autismCategory].color} text-white p-2 rounded-lg w-full`}
            >
              {autismLevels[autismCategory].label}
            </TabsTrigger>
          )}
        </TabsList>

        <div className="text-sm italic text-red-500 my-4">
          Complete previous week before jumping to the next (
          <span className="font-bold">Note</span>: Only the first detection data
          will be counted from the table)
        </div>

        <TabsContent value={categoryKey} className="p-4 border rounded-lg">
          <Accordion type="single" collapsible className="w-full">
            {categoryData?.map((weekData, weekIndex) => (
              <AccordionItem
                key={weekIndex}
                value={`week-${weekData.week}`}
                disabled={
                  weekData.week > 1 && !isWeekCompleted(weekData.week - 1)
                }
              >
                <AccordionTrigger>Week {weekData.week}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {weekData.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Checkbox
                          checked={
                            checkedItems[`week-${weekData.week}-${index}`] ||
                            false
                          }
                          onCheckedChange={() =>
                            handleCheckboxChange(weekData.week, index)
                          }
                        />
                        <span>{suggestion.title}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-gray-400 hover:text-gray-600 cursor-help">
                                ℹ️
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{suggestion.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
