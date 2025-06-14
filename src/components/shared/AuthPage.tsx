// pages/auth.tsx
"use client";
import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleSignIn, loginWithEmail, signUpWithEmail } from "../../lib/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";

const AuthPageContent = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/detect";

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await signUpWithEmail({ email, password });
        if (userCredential) {
          alert("Check your email to verify your account!");
          // Don't redirect after signup, let user verify email first
          setIsSignUp(false); // Switch to login view
        }
      } else {
        const userCredential = await loginWithEmail({ email, password });
        if (userCredential) {
          // Store user email in cookie
          document.cookie = `userEmail=${email}; path=/; max-age=86400`; // 24 hours expiry
          alert("Logged in successfully!");
          // Only redirect after successful login
          window.location.href = redirectTo;
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const userCredential = await googleSignIn();
      if (userCredential) {
        // Store user email in cookie
        if (userCredential.user.email) {
          document.cookie = `userEmail=${userCredential.user.email}; path=/; max-age=86400`; // 24 hours expiry
        }
        // Only redirect after successful Google login
        window.location.href = redirectTo;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Please enter a valid email address (e.g., name@example.com)"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a valid email address (e.g., name@example.com)
            </p>
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
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be of 6 characters or more
            </p>
          </div>
        </div>

        {/* forgot password  */}
        <div>
          <p className="text-sm text-gray-500 mt-1">
            {isSignUp ? (
              ""
            ) : (
              <Link
                href="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot password? Reset Password
              </Link>
            )}
          </p>
        </div>

        <Button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button
          onClick={handleGoogleLogin}
          className="w-full mt-2 bg-red-500 text-white hover:bg-red-600"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Sign Up / Login with Google"}
        </Button>
        <p className="text-sm mt-2">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline"
            disabled={isLoading}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

const AuthPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
};

export default AuthPage;
