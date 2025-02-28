/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type SuggestionEntry = {
  limit: number;
  suggestion: string;
  category: number;
  status: string; // Add this line
};

type ResultsDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  error: string | null;
  results: any; // Replace 'any' with the appropriate type if known
  suggestionsData: SuggestionEntry[];
  user: any;
};

export default function ResultsDialog({
  isOpen,
  setIsOpen,
  isLoading,
  error,
  results,
  suggestionsData,
  user,
}: ResultsDialogProps) {
  // Modify the mutation to handle the "user already saved" error
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        return alert("Please login to save the results");
      }

      const autismCategory = getAutismResult(
        results,
        suggestionsData
      )?.autismCategory;

      try {
        // Save the results to the database
        await axios.post("/api/save", {
          results,
          autismCategory,
          email: user.email,
          uid: user.uid,
        });
        alert("Results saved successfully!");
        setIsOpen(false);
      } catch (err: any) {
        if (err?.response?.data?.error) {
          alert("You have already submitted your data.");
        } else {
          alert("Failed to save data.");
        }
      }
    },
  });

  interface AutismResult {
    autismStatus: string;
    riskColor: string;
    relevantSuggestions: string[];
    autismCategory: number;
  }

  const getAutismResult = (
    results: {
      form?: { confidence?: number; prediction?: boolean };
      video?: { confidence?: number; prediction?: boolean };
      images?: { confidence: number; prediction: boolean }[];
    } | null,
    suggestionsData: SuggestionEntry[]
  ): AutismResult | null => {
    if (!results) return null;

    const predictions = [
      results.form?.confidence || 0,
      results.video?.confidence || 0,
      ...(results.images?.map(
        (img: { confidence: number }) => img.confidence
      ) || []),
    ];

    const avgConfidence =
      predictions.length > 0
        ? predictions.reduce((acc, val) => acc + val, 0) / predictions.length
        : 0;

    console.log("Avg Confidence:", avgConfidence);

    // Find highest matching category based on avgConfidence
    const categoryEntry =
      [...suggestionsData]
        .reverse()
        .find((entry) => avgConfidence >= entry.limit) || suggestionsData[0];

    const autismCategory = categoryEntry.category;
    console.log(autismCategory);
    const autismStatus = categoryEntry.status; // Changed this line to get autismStatus

    const riskColor =
      autismCategory === 3
        ? "text-red-600"
        : autismCategory === 2
        ? "text-orange-600"
        : "text-green-600";

    const relevantSuggestions = Array.isArray(categoryEntry.suggestion)
      ? categoryEntry.suggestion
      : [categoryEntry.suggestion];

    return { autismStatus, riskColor, relevantSuggestions, autismCategory };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLoading ? "Analyzing..." : "Results"}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <DialogDescription className="text-center">
            🔄 Please wait while we analyze the data...
          </DialogDescription>
        ) : error ? (
          <DialogDescription className="text-red-600">
            ❌ {error}
          </DialogDescription>
        ) : (
          <div className="space-y-4">
            <p>
              <strong>📊 Questionnaire Result:</strong>{" "}
              {results?.form?.prediction ? "Detected" : "Not Detected"}
            </p>
            <p>
              <strong>🎥 Video Analysis:</strong>{" "}
              {results?.video?.prediction !== null
                ? results?.video?.prediction
                  ? "Detected"
                  : "Not Detected"
                : "Not Provided"}
            </p>
            <p>
              <strong>🖼️ Image Analysis:</strong>{" "}
              {results?.images?.length
                ? results.images.some(
                    (img: { prediction: boolean }) => img?.prediction
                  )
                  ? "Detected"
                  : "Not Detected"
                : "Not Provided"}
            </p>
            {(() => {
              const autismResult = getAutismResult(results, suggestionsData);
              return autismResult ? (
                <>
                  <p className={`text-lg font-bold ${autismResult.riskColor}`}>
                    🧩 {autismResult.autismStatus}
                  </p>
                  {autismResult.relevantSuggestions.length > 0 && (
                    <div className="mt-2">
                      <h3 className="font-semibold">📝 Recommendations:</h3>
                      <ul className="list-disc pl-5 text-gray-700">
                        {autismResult.relevantSuggestions.map(
                          (suggestion: string, index: number) => (
                            <li key={index}>{suggestion}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </>
              ) : null;
            })()}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
