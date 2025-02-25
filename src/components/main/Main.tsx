"use client";

import React, { useEffect } from "react";
// import TabNavigation from "./TabNavigation";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/useAuth";
import HeroSection from "./HeroSection";

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
      <div>
        {!user ? (
          <p className="text-center">
            Only logged-in users can access this page. Create an account/ login
          </p>
        ) : (
          // <TabNavigation />
          <div>
            <HeroSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
