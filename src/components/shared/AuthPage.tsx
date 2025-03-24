/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/auth.tsx
"use client";
import { useState, FormEvent } from "react";
// import { useRouter } from "next/navigation";
import { googleSignIn, loginWithEmail, signUpWithEmail } from "../../lib/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AuthPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await signUpWithEmail({ email, password });
        alert("Check your email to verify your account!");
      } else {
        await loginWithEmail({ email, password });
        alert("Logged in successfully!");
        window.location.href = "/detect"; // Full redirect
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      window.location.href = "/detect"; // Full redirect
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4">
        {isSignUp ? "Sign Up" : "Login"}
      </h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 mt-1 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 mt-1 border rounded"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button
          onClick={handleGoogleLogin}
          className="w-full mt-2 bg-red-500 text-white hover:bg-red-600"
        >
          Sign Up / Login with Google
        </Button>
        <p className="text-sm mt-2">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
