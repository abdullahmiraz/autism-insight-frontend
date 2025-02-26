"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import InitialQuery from "./InitialQuery";
import SelectInput from "./SelectInput";
import { useAuth } from "../../../lib/useAuth";

export default function DetectionForm() {
  const { user, loading } = useAuth();

  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // get the questions
  const [questionsData, setQuestionsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/questionsData.json");
        const data = await response.json();
        setQuestionsData(data);
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Mutation for each API
  const videoMutation = useMutation({
    mutationFn: async (video: File) => {
      const formData = new FormData();
      formData.append("video", video);
      const response = await axios.post(
        "http://127.0.0.1:8000/predict-video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
  });

  const imagesMutation = useMutation({
    mutationFn: async (images: FileList) => {
      const formData = new FormData();
      Array.from(images).forEach((image) => formData.append("images", image));
      const response = await axios.post(
        "http://127.0.0.1:8000/predict-images",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
  });

  const formMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("http://127.0.0.1:8000/predict", data);
      return response.data;
    },
  });

  // Form submission
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setModalOpen(true);
    setError(null);
    setResults(null);

    const questions = Object.fromEntries(
      Object.entries(data.questions).map(([key, value]) => [key, Number(value)])
    );

    const formattedData = {
      ...questions,
      Age_Mons: Number(data.age_mons),
      Sex: Number(data.sex),
      Ethnicity: Number(data.ethnicity),
      Jaundice: Number(data.jaundice),
      Family_mem_with_ASD: Number(data.family_mem_with_asd),
    };

    try {
      const [formResult, videoResult, imagesResult] = await Promise.all([
        formMutation.mutateAsync(formattedData),
        data.video?.[0]
          ? videoMutation.mutateAsync(data.video[0])
          : Promise.resolve(null),
        data.images?.length > 0
          ? imagesMutation.mutateAsync(data.images)
          : Promise.resolve(null),
      ]);

      setResults({
        form: formResult,
        video: videoResult,
        images: imagesResult,
      });
    } catch (err: any) {
      setError("Failed to fetch predictions. Please try again.");
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // console.log(results);

      if (!user) {
        return alert("Please login to save the results");
      }

      const response = await axios.post("/api/save", {
        results,
        email: user && user.email,
        uid: user && user.uid,
      });

      // console.log(response, results);
      alert("Results saved successfully!");
      setModalOpen(false);

      return response.data;
    },
  });

  return (
    <div className="container mx-auto p-4 md:p-0 my-12">
      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
        <h2 className="text-2xl font-semibold text-center">
          Autism Symptom Detection
        </h2>
        <InitialQuery register={register} />
        <Separator />

        {/* Dynamic Questions */}
        <div className="space-y-4">
          {questionsData.map((question, index) => (
            <SelectInput
              key={question.id}
              label={question.label}
              name={`questions.${question.id}`}
              index={index}
              options={question.options}
              register={register}
              required
            />
          ))}
        </div>

        {/* File Uploads */}
        <div>
          <h3 className="text-lg font-semibold">
            Upload Images (png, jpeg, jpg)
          </h3>
          <input
            type="file"
            {...register("images")}
            accept=".png, .jpeg, .jpg"
            multiple
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Upload Video (avi, mp4)</h3>
          <input
            type="file"
            {...register("video")}
            accept=".avi, .mp4"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <Button type="submit" className="w-full">
          Analyze Symptoms
        </Button>
        <Separator />

        {results && (
          <div>
            <div className="text-center text-3xl font-bold underline mb-4">
              Predicted Result
            </div>{" "}
            <div className="space-y-4">
              <p>
                <strong>📊 Questionnaire Prediction:</strong>{" "}
                {JSON.stringify(results?.form) || "N/A"}
              </p>
              <p>
                <strong>🎥 Video Prediction:</strong>{" "}
                {JSON.stringify(results?.video) || "N/A"}
              </p>
              <p>
                <strong>🖼️ Image Prediction:</strong>{" "}
                {JSON.stringify(results?.images) || "N/A"}
              </p>
            </div>
          </div>
        )}
      </form>

      {/* Modal for Loading and Results */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
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
                <strong>📊 Questionnaire Prediction:</strong>{" "}
                {JSON.stringify(results?.form) || "N/A"}
              </p>
              <p>
                <strong>🎥 Video Prediction:</strong>{" "}
                {JSON.stringify(results?.video) || "N/A"}
              </p>
              <p>
                <strong>🖼️ Image Prediction:</strong>{" "}
                {JSON.stringify(results?.images) || "N/A"}
              </p>

              {/* Save & Cancel Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
