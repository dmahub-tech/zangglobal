import React from "react";
import { partnerAwardData } from "../../../constants";

const PartnersAndAwards = () => {
  return (
    <div id="partners" className=" mx-auto w-full p-6 bg-primary text-neutralGray">
      {/* Partners Section */}
      <h2 className="text-xl font-bold mb-4 text-secondary">Our Partners and Supporters</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {partnerAwardData.partners.map((partner, index) => (
          <div key={index} className="flex flex-col items-center p-4 rounded-lg">
            <img src={partner.image} alt={partner.name} className="w-28 h-28 object-contain" />
            {/* <p className="text-sm mt-2 text-background font-semibold">{partner.name}</p> */}
          </div>
        ))}
      </div>

      {/* Awards Section */}
      <div id="awards">
        
      <h2 className="text-xl font-bold mt-8 mb-4 text-secondary">Awards & Recognitions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {partnerAwardData.awards.map((award, index) => (
          <div key={index} className="flex items-center flex-col p-4 rounded-lg shadow-md bg-[#ebe2b8]">
            <img src={award.image} alt={award.title} className="w-40 h-40 object-cover mb-2 rounded-lg" />
            <div className="text-center">
              <h3 className="font-semibold text-primary">{award.title}</h3>
              <p className="text-sm text-mutedPrimary">{award.year}</p>
              {award.organization && <p className="text-xs text-mutedPrimary">{award.organization}</p>}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersAndAwards;
