import React from "react";
import {teamMembers} from "../../../constants"


function OurTeam() {
  return (
    <section
      id="team"
      className="bg-primary py-16 px-6 md:px-16 lg:px-24"
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-secondary">Meet Our Team</h2>
        <p className="text-mutedSecondary text-lg mt-2">
          Our dedicated team members work hard to make our vision a reality.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-44 h-44 object-contain rounded-full mx-auto border-4 border-mutedPrimary"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-primary">{member.name}</h3>
              <p className="text-mutedPrimary italic  text-sm mt-2">{member.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurTeam;
