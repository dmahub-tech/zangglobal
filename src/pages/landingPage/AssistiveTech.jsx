import React from "react";

const AssistiveTechPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 text-center text-xl font-bold">
        Assistive and Inclusive Technology
      </header>

      {/* Main Content */}
      <main className="max-w-4xl  mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4">Computer Foot Mouse</h2>
        <p className="text-gray-700 mb-4">
          The Computer Foot Mouse is an innovative device designed to improve
          the lives of individuals with disabilities, especially amputees. This
          technology allows users to interact with computers using foot
          movements, providing them with greater independence and access to
          digital tools for education, employment, and social interaction.
        </p>
        <p className="text-gray-700 mb-4">
          This solution is aimed at creating a more inclusive and equitable
          society by ensuring that individuals of all abilities can engage with
          the digital world. By providing adaptive tools, we break down
          barriers and promote independence.
        </p>
        <p className="text-gray-700 font-semibold">Join us in making a difference.</p>
      </main>

      
    </div>
  );
};

export default AssistiveTechPage;
