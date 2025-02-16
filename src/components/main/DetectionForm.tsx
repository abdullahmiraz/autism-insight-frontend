/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

      {/* Communication Section */}
      <div>
        <h3 className="text-lg font-semibold">Communication</h3>
        <textarea
          {...register("communication.languageDevelopment")}
          placeholder="Describe language skills"
          className="w-full p-2 border rounded-md"
        />
        <select
          {...register("communication.vocabularySize")}
          className="w-full p-2 border rounded-md mt-2"
        >
          <option value="">Select vocabulary range</option>
          <option value="limited">Limited</option>
          <option value="average">Average</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Repetitive Behavior Section */}
      <div>
        <h3 className="text-lg font-semibold">Repetitive Behavior</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("repetitiveBehavior.handFlapping")}
            className="w-4 h-4"
          />
          <span>Hand flapping</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("repetitiveBehavior.liningUpToys")}
            className="w-4 h-4"
          />
          <span>Lining up toys</span>
        </label>
      </div>

      {/* Sensory Sensitivities Section */}
      <div>
        <h3 className="text-lg font-semibold">Sensory Sensitivities</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("sensory.soundSensitivity")}
            className="w-4 h-4"
          />
          <span>Sound sensitivity</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("sensory.touchSensitivity")}
            className="w-4 h-4"
          />
          <span>Touch sensitivity</span>
        </label>
      </div>

      {/* Mood Tracking */}
      <div>
        <h3 className="text-lg font-semibold">Mood Tracking</h3>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              {...register("moodTracking.anxietyLevel")}
              value="low"
              className="w-4 h-4"
            />
            <span>Low Anxiety</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              {...register("moodTracking.anxietyLevel")}
              value="moderate"
              className="w-4 h-4"
            />
            <span>Moderate Anxiety</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              {...register("moodTracking.anxietyLevel")}
              value="high"
              className="w-4 h-4"
            />
            <span>High Anxiety</span>
          </label>
        </div>
      </div>

      {/* Daily Living Skills */}
      <div>
        <h3 className="text-lg font-semibold">Daily Living Skills</h3>
        <select
          {...register("dailyLivingSkills.dressing")}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select dressing ability</option>
          <option value="independent">Independent</option>
          <option value="assisted">Needs assistance</option>
          <option value="dependent">Fully dependent</option>
        </select>
      </div>

      {/* Health & Wellbeing */}
      <div>
        <h3 className="text-lg font-semibold">Health & Wellbeing</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("health.sleepIssues")}
            className="w-4 h-4"
          />
          <span>Sleep disturbances</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("health.foodIssues")}
            className="w-4 h-4"
          />
          <span>Food aversions</span>
        </label>
      </div>

      {/* File Upload: Image */}
      <div>
        <h3 className="text-lg font-semibold">Upload Image</h3>
        <input
          type="file"
          {...register("media.image", { required: false })}
          accept=".png, .jpeg, .jpg"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* File Upload: Video */}
      <div>
        <h3 className="text-lg font-semibold">Upload Video</h3>
        <input
          type="file"
          {...register("media.video", { required: false })}
          accept=".avi, .mp4"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Analyzing..." : "Analyze Symptoms"}
      </Button>

      {mutation.data && (
        <p className="text-green-600 text-center mt-4">
          {mutation.data.message}
        </p>
      )}
    </form>
  );
}
