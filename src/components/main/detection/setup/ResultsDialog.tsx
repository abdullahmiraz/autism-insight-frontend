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
      form?: { prediction?: number };
      videos?: { prediction?: number };
      images?: { prediction?: number }[];
    } | null,
    suggestionsData: SuggestionEntry[]
  ): AutismResult | null => {
    if (!results) return null;

    // Count number of detections:
    const detections = [
      results.form?.prediction === 1, // Form: 1 means detected
      Array.isArray(results.videos) &&
        results.videos.some((v) => v.prediction === 0), // Any video detected
      ...(results.images?.map((img) => img.prediction === 0) || []), // Image detections
    ].filter(Boolean).length;

    console.log("Total Detections:", detections);

    // Determine autism severity based on detections
    const severityLevel =
      detections === 1
        ? "Low"
        : detections === 2
        ? "Mid"
        : detections === 3
        ? "Extreme"
        : "None";

    // Find the corresponding category from suggestionsData
    const categoryEntry =
      suggestionsData.find(
        (entry) => entry.status.toLowerCase() === severityLevel.toLowerCase()
      ) || suggestionsData[0];

    const autismCategory = categoryEntry.category;
    const autismStatus = categoryEntry.status;

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
              <strong>📊 Questionnaire Result:</strong>
              {results?.form?.prediction == 1
                ? " Autism  Detected"
                : " Autism Not Detected"}
            </p>
            <p>
              <strong>🎥 Video Analysis:</strong>
              {!Array.isArray(results?.videos) || results.videos.length === 0
                ? " File Not Provided"
                : results.videos.some(
                    (vid: { prediction: number }) => vid.prediction === 0
                  )
                ? " Autism Detected"
                : " Autism Not Detected"}
            </p>

            <p>
              <strong>🖼️ Image Analysis:</strong>
              {results?.images?.length
                ? results.images.some(
                    (img: { prediction: number }) => img.prediction === 0
                  )
                  ? " Autism Detected"
                  : " Autism Not Detected"
                : " File Not Provided"}
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
