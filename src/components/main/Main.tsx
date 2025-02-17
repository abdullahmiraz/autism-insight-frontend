"use client";

import React, { useEffect } from "react";
import TabNavigation from "./TabNavigation";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/useAuth";

const Main = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to '/login' if the user is not logged in
    if (!loading && !user) {
      alert(
        "Only logged-in users can access this page. Create an account/ login."
      );
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Autism Insight</h1>
        {!user ? (
          <p className="text-center">
            Only logged-in users can access this page. Create an account/ login
          </p>
        ) : (
          <TabNavigation />
        )}
      </div>
    </div>
  );
};

export default Main;
