 "use client";

import React from "react";
import { useAuth } from "../../lib/useAuth";
import HeroSection from "./HeroSection";

const Main = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Home page is public, so always show HeroSection */}
      <HeroSection />
    </div>
  );
};

export default Main;
