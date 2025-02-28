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
import axios from "axios";

type AutismPlan = {
  week: number;
  suggestions: string[];
};

const autismPlans: { [key: number]: AutismPlan[] } = {
  1: [
    // mild
    {
      week: 1,
      suggestions: [
        "Establish a routine",
        "Encourage eye contact",
        "Use simple language",
      ],
    },
    {
      week: 2,
      suggestions: [
        "Introduce social play",
        "Use visual aids",
        "Read short stories together",
      ],
    },
    {
      week: 3,
      suggestions: [
        "Encourage pointing at objects",
        "Practice turn-taking",
        "Use basic sign language",
      ],
    },
    {
      week: 4,
      suggestions: [
        "Play interactive games",
        "Use positive reinforcement",
        "Teach emotions using pictures",
      ],
    },
    {
      week: 5,
      suggestions: [
        "Introduce new textures",
        "Use sensory-friendly toys",
        "Encourage imitation games",
      ],
    },
    {
      week: 6,
      suggestions: [
        "Practice two-word phrases",
        "Encourage responding to name",
        "Play 'follow the leader'",
      ],
    },
    {
      week: 7,
      suggestions: [
        "Sing songs together",
        "Encourage role-playing",
        "Introduce deep-pressure activities",
      ],
    },
    {
      week: 8,
      suggestions: [
        "Teach simple coping strategies",
        "Use picture cards for communication",
        "Encourage independent play",
      ],
    },
    {
      week: 9,
      suggestions: [
        "Expand vocabulary with objects",
        "Practice greeting people",
        "Play with soft music",
      ],
    },
    {
      week: 10,
      suggestions: [
        "Encourage choice-making",
        "Use social stories",
        "Introduce basic self-care routines",
      ],
    },
    {
      week: 11,
      suggestions: [
        "Teach emotional regulation",
        "Encourage peer interactions",
        "Practice short conversations",
      ],
    },
    {
      week: 12,
      suggestions: [
        "Review progress",
        "Continue positive reinforcement",
        "Encourage more independence",
      ],
    },
  ],
  2: [
    // moderate
    {
      week: 1,
      suggestions: [
        "Use structured schedules",
        "Introduce sensory-friendly spaces",
        "Practice basic commands",
      ],
    },
    {
      week: 2,
      suggestions: [
        "Use hand-over-hand guidance",
        "Encourage imitation",
        "Introduce interactive books",
      ],
    },
    {
      week: 3,
      suggestions: [
        "Increase response time expectations",
        "Use more visual communication",
        "Encourage simple gestures",
      ],
    },
    {
      week: 4,
      suggestions: [
        "Introduce social games",
        "Practice naming emotions",
        "Encourage following instructions",
      ],
    },
    {
      week: 5,
      suggestions: [
        "Use sensory-friendly activities",
        "Encourage physical activities",
        "Practice sitting still",
      ],
    },
    {
      week: 6,
      suggestions: [
        "Expand vocabulary using objects",
        "Use first-then strategies",
        "Encourage joint attention",
      ],
    },
    {
      week: 7,
      suggestions: [
        "Encourage interactive play",
        "Use positive reinforcement",
        "Practice waiting for turns",
      ],
    },
    {
      week: 8,
      suggestions: [
        "Teach simple coping skills",
        "Encourage self-expression",
        "Use reward charts",
      ],
    },
    {
      week: 9,
      suggestions: [
        "Practice basic social rules",
        "Encourage story-telling",
        "Use calming activities",
      ],
    },
    {
      week: 10,
      suggestions: [
        "Practice responding to greetings",
        "Introduce social scripts",
        "Encourage independence",
      ],
    },
    {
      week: 11,
      suggestions: [
        "Teach basic hygiene routines",
        "Encourage parallel play",
        "Practice structured routines",
      ],
    },
    {
      week: 12,
      suggestions: [
        "Review progress",
        "Reinforce positive behaviors",
        "Plan future goals",
      ],
    },
  ],
  3: [
    //extreme
    {
      week: 1,
      suggestions: [
        "Establish predictable routines",
        "Introduce deep-pressure therapy",
        "Minimize sensory overload",
      ],
    },
    {
      week: 2,
      suggestions: [
        "Use one-step instructions",
        "Encourage non-verbal communication",
        "Introduce soft lighting",
      ],
    },
    {
      week: 3,
      suggestions: [
        "Practice calming techniques",
        "Use fidget tools",
        "Introduce simple choice-making",
      ],
    },
    {
      week: 4,
      suggestions: [
        "Encourage repetitive play with variations",
        "Use structured interactions",
        "Introduce basic cause-and-effect toys",
      ],
    },
    {
      week: 5,
      suggestions: [
        "Reduce environmental triggers",
        "Encourage safe movement exploration",
        "Use adaptive communication tools",
      ],
    },
    {
      week: 6,
      suggestions: [
        "Expand sensory play options",
        "Encourage touch-based interactions",
        "Use soothing background music",
      ],
    },
    {
      week: 7,
      suggestions: [
        "Practice tolerance to small changes",
        "Encourage simple turn-taking",
        "Use reward-based learning",
      ],
    },
    {
      week: 8,
      suggestions: [
        "Introduce simple sign language",
        "Use visual schedules",
        "Encourage following one-step commands",
      ],
    },
    {
      week: 9,
      suggestions: [
        "Practice eye-tracking games",
        "Encourage physical engagement",
        "Use alternative communication",
      ],
    },
    {
      week: 10,
      suggestions: [
        "Introduce limited social exposure",
        "Encourage basic object labeling",
        "Practice calming strategies",
      ],
    },
    {
      week: 11,
      suggestions: [
        "Use structured playtime",
        "Introduce sensory-friendly outings",
        "Encourage recognition of familiar faces",
      ],
    },
    {
      week: 12,
      suggestions: [
        "Review progress",
        "Encourage consistency",
        "Plan long-term strategies",
      ],
    },
  ],
};
export default function AutismIntervention({
  autismCategory = 1,
}: {
  autismCategory: number;
}) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const userId = user?.uid;

  console.log(userId);

  // 📌 Fetch saved progress from API
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

  // 📌 Save progress to API
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

  const autismLevels: { [key: number]: { label: string; color: string } } = {
    1: { label: "Mild Autism", color: "bg-blue-500" },
    2: { label: "Moderate Autism", color: "bg-yellow-500" },
    3: { label: "Extreme Autism", color: "bg-red-500" },
  };
  return (
    <Tabs defaultValue={String(autismCategory)} className="w-full">
      <TabsList className="flex justify-center">
        {autismLevels[autismCategory] && (
          <TabsTrigger
            value={String(autismCategory)}
            className={`${autismLevels[autismCategory].color} text-white p-2 rounded-lg`}
          >
            {autismLevels[autismCategory].label}
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent
        value={String(autismCategory)}
        className="p-4 border rounded-lg"
      >
        <Accordion type="single" collapsible className="w-full">
          {autismPlans[autismCategory]?.map(
            (weekData: any, weekIndex: number) => (
              <AccordionItem key={weekIndex} value={`week-${weekData.week}`}>
                <AccordionTrigger>Week {weekData.week}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {weekData.suggestions.map(
                      (suggestion: string, index: number) => (
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
                          <span>{suggestion}</span>
                        </li>
                      )
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )
          )}
        </Accordion>
      </TabsContent>
    </Tabs>
  );
}
