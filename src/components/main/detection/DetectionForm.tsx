/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import SelectInput from "./SelectInput";

// Define the questions array
const questionsData = [
  {
    id: "q1",
    label: " Does your child look at you when you call his/her name?",
    options: ["Yes", "No"],
  },
  {
    id: "q2",
    label: " How easy is it for you to get eye contact with your child?",
    options: ["Easy", "Difficult"],
  },
  {
    id: "q3",
    label:
      "Does your child point to indicate that s/he wants something? (e.g. a toy that is out of reach)",
    options: ["Yes", "No"],
  },
  {
    id: "q4",
    label:
      "Does your child point to share interest with you? (e.g. pointing at an interesting sight)",
    options: ["Yes", "No"],
  },
  {
    id: "q5",
    label:
      "Does your child pretend? (e.g. care for dolls, talk on a toy phone)",
    options: ["Yes", "No"],
  },
  {
    id: "q6",
    label: "Does your child follow where you’re looking?",
    options: ["Yes", "No"],
  },
  {
    id: "q7",
    label:
      "If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them? (e.g. stroking hair, hugging them)",
    options: ["Yes", "No"],
  },
  {
    id: "q8",
    label: "Would you describe your child’s first words as:",
    options: ["Early", "Late"],
  },
  {
    id: "q9",
    label: "Does your child use simple gestures? (e.g. wave goodbye)",
    options: ["Yes", "No"],
  },
  {
    id: "q10",
    label: "Does your child stare at nothing with no apparent purpose?",
    options: ["Yes", "No"],
  },
];

export default function DetectionForm() {
  const { register, handleSubmit, reset } = useForm();

  // Directly using React Query mutation inside the component
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/detect", data);
      return response.data;
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    mutation.mutate(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white shadow-md rounded-md"
    >
      <h2 className="text-2xl font-semibold text-center">
        Autism Symptom Detection
      </h2>

      {/* Map through the questionsData array to render each question */}
      <div className="space-y-4">
        {questionsData.map((question, index) => (
          <SelectInput
            key={question.id}
            label={question.label}
            name={`questions.${question.id}`}
            index={index}
            options={question.options}
            register={register}
            required={true}
          />
        ))}
      </div>

      {/* File Upload: Multiple Images */}
      <div>
        <h3 className="text-lg font-semibold">
          Upload Images{" "}
          <span className="text-sm font-light italic text-blue-800">
            *supported formats : png, jpeg, jpg
          </span>
        </h3>
        <input
          type="file"
          {...register("media.images", { required: false })}
          accept=".png, .jpeg, .jpg"
          multiple
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* File Upload: One Video */}
      <div>
        <h3 className="text-lg font-semibold">
          Upload Video{" "}
          <span className="text-sm font-light italic text-blue-800">
            *supported formats : avi, mp4
          </span>
        </h3>
        <input
          type="file"
          {...register("media.video", { required: false })}
          accept=".avi, .mp4"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Analyze Symptoms
      </Button>
    </form>
  );
}
