import React from "react";
import TabNavigation from "./TabNavigation";

const Main = () => {
  return (
    <div>
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Autism Insight</h1>
        <TabNavigation />
      </div>
    </div>
  );
};

export default Main;
