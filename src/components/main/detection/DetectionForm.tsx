"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
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

// Define the questions array
const questionsData = [
  {
    id: "A1",
    label: " Does your child look at you when you call his/her name?",
    options: ["No", "Yes"],
  },
  {
    id: "A2",
    label: " How easy is it for you to get eye contact with your child?",
    // options: ["Easy", "Difficult"],
    options: ["No", "Yes"],
  },
  {
    id: "A3",
    label:
      "Does your child point to indicate that s/he wants something? (e.g. a toy that is out of reach)",
    options: ["No", "Yes"],
  },
  {
    id: "A4",
    label:
      "Does your child point to share interest with you? (e.g. pointing at an interesting sight)",
    options: ["No", "Yes"],
  },
  {
    id: "A5",
    label:
      "Does your child pretend? (e.g. care for dolls, talk on a toy phone)",
    options: ["No", "Yes"],
  },
  {
    id: "A6",
    label: "Does your child follow where you’re looking?",
    options: ["No", "Yes"],
  },
  {
    id: "A7",
    label:
      "If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them? (e.g. stroking hair, hugging them)",
    options: ["No", "Yes"],
  },
  {
    id: "A8",
    label: "Would you describe your child’s first words as:",
    // options: ["Early", "Late"],
    options: ["No", "Yes"],
  },
  {
    id: "A9",
    label: "Does your child use simple gestures? (e.g. wave goodbye)",
    options: ["No", "Yes"],
  },
  {
    id: "A10",
    label: "Does your child stare at nothing with no apparent purpose?",
    options: ["No", "Yes"],
  },
];

export default function DetectionForm() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-white shadow-md rounded-md"
      >
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
            <div className="text-center text-3xl font-bold underline">
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
