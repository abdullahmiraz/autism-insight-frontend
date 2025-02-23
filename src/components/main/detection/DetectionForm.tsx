/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import SelectInput from "./SelectInput";
import InitialQuery from "./InitialQuery";
import { Separator } from "../../ui/separator";

// Define the questions array
const questionsData = [
  {
    id: "A1",
    label: " Does your child look at you when you call his/her name?",
    options: ["Yes", "No"],
  },
  {
    id: "A2",
    label: " How easy is it for you to get eye contact with your child?",
    // options: ["Easy", "Difficult"],
    options: ["Yes", "No"],
  },
  {
    id: "A3",
    label:
      "Does your child point to indicate that s/he wants something? (e.g. a toy that is out of reach)",
    options: ["Yes", "No"],
  },
  {
    id: "A4",
    label:
      "Does your child point to share interest with you? (e.g. pointing at an interesting sight)",
    options: ["Yes", "No"],
  },
  {
    id: "A5",
    label:
      "Does your child pretend? (e.g. care for dolls, talk on a toy phone)",
    options: ["Yes", "No"],
  },
  {
    id: "A6",
    label: "Does your child follow where you’re looking?",
    options: ["Yes", "No"],
  },
  {
    id: "A7",
    label:
      "If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them? (e.g. stroking hair, hugging them)",
    options: ["Yes", "No"],
  },
  {
    id: "A8",
    label: "Would you describe your child’s first words as:",
    // options: ["Early", "Late"],
    options: ["Yes", "No"],
  },
  {
    id: "A9",
    label: "Does your child use simple gestures? (e.g. wave goodbye)",
    options: ["Yes", "No"],
  },
  {
    id: "A10",
    label: "Does your child stare at nothing with no apparent purpose?",
    options: ["Yes", "No"],
  },
];

export default function DetectionForm() {
  const { register, handleSubmit, reset } = useForm();

  // 1️⃣ Mutation for Video Upload
  const videoMutation = useMutation({
    mutationFn: async (video: File) => {
      const formData = new FormData();
      formData.append("video", video);

      const response = await axios.post(
        "http://127.0.0.1:8000/predict-video",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => console.log("Video Prediction Response:", data),
    onError: (error) => console.error("Error uploading video:", error),
  });

  // 2️⃣ Mutation for Image Upload
  const imagesMutation = useMutation({
    mutationFn: async (images: FileList) => {
      const formData = new FormData();
      Array.from(images).forEach((image) => formData.append("images", image));

      const response = await axios.post(
        "http://127.0.0.1:8000/predict-images",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => console.log("Image Prediction Response:", data),
    onError: (error) => console.error("Error uploading images:", error),
  });

  // Directly using React Query mutation inside the component
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("http://127.0.0.1:8000/predict", data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Prediction Response:", data);
    },
    onError: (error) => {
      console.error("Error submitting data:", error);
    },
  });

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);

    const questions = Object.fromEntries(
      Object.entries(data.questions).map(([key, value]) => [key, Number(value)])
    );

    const formattedData = {
      Case_No: 0,
      ...questions,
      Age_Mons: 28,
      Qchat_10_Score: 3,
      Ethnicity: "middle eastern",
      Jaundice: "yes",
      Family_mem_with_ASD: "no",
      Sex: String(data.sex),
      Who_completed_test: "family member",
      "Class/ASD Traits": "No",
    };
    console.log(formattedData);

    // 1️⃣ Call the mutation for questionnaire prediction (predict)
    mutation.mutate(formattedData);

    // 2️⃣ Call the mutation for video prediction (predict-video)
    if (data.video) {
      videoMutation.mutate(data.video);
    }

    // 3️⃣ Call the mutation for image prediction (predict-images)
    if (data.images && data.images.length > 0) {
      imagesMutation.mutate(data.images);
    }

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

      {/* Initial Query Component */}
      <InitialQuery register={register} />

      <Separator />

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
