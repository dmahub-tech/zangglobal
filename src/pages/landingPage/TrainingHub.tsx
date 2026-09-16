import React from "react";
import { Link } from "react-router-dom";

const TrainingHub = () => {
  const sectionsData = [
    {
      title: "E-waste Recycling into Sustainable Products",
      description: "Learn how to transform electronic waste into sustainable products. This program covers collection, dismantling, and recycling e-waste, along with innovative methods for repurposing materials.",
    },
    {
      title: "Solar System Design, Installation, and Maintenance",
      description: "Dive into solar energy with comprehensive training on system design, installation, and maintenance. Learn best practices for promoting renewable energy solutions in communities.",
    },
    {
      title: "AI and Robotics for Sustainable Development",
      description: "Explore the intersection of AI, robotics, and sustainability. Learn how modern technologies enhance efficiency in waste management, energy conservation, and resource optimization.",
    },
   
  ];

  return (
    <div className="bg-gray-100 mt-[50px] min-h-screen p-6">
      <header
        className="relative h-[40vh] flex items-center justify-center flex-col text-center py-6 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: "url('./icon.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold">Welcome to Our Skills Training Hub</h1>
          <p className="mt-2 italic">
            “Education is the passport to the future, for tomorrow belongs to those who prepare for it today.” - Malcolm X
          </p>
        </div>
      </header>

      <main className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 space-x-3">
        {sectionsData.map((section, index) => (
          <section key={index} className="bg-mutedSecondary shadow-lg p-6 mt-5 rounded-lg">
            <h2 className="text-2xl font-semibold text-primary">{section.title}</h2>
            <p className="mt-2 text-gray-700">{section.description}</p>
          </section>
        ))}
      </main>
    </div>
  );
};

export default TrainingHub;
