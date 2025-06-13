// src/pages/InitiativesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import initiatives from "../../initiatives";

const InitiativesPage = () => {
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (initiative) => {
    setSelectedInitiative(initiative);
    navigate(`/initiatives/${initiative.id}`);
  };

  const handleBackClick = () => {
    setSelectedInitiative(null);
    navigate("/initiatives");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {selectedInitiative ? (
        <InitiativeDetail
          initiative={selectedInitiative}
          onBack={handleBackClick}
        />
      ) : (
        <InitiativeList initiatives={initiatives} onCardClick={handleCardClick} />
      )}
    </div>
  );
};

const InitiativeList = ({ initiatives, onCardClick }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Our Initiatives
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Discover the innovative projects and sustainable solutions we're working on.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {initiatives.map((initiative) => (
          <div
            key={initiative.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => onCardClick(initiative)}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={initiative.thumbnail}
                alt={initiative.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {initiative.title}
              </h2>
              <p className="text-gray-600 mb-4">{initiative.description}</p>
              <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300">
                Learn more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default InitiativesPage;