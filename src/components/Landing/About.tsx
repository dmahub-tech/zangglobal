import React from "react";
import { FaGlobe, FaLightbulb, FaUsers, FaLeaf, FaHandshake, FaBalanceScale } from "react-icons/fa";
import { MdOutlineElectricBolt, MdFactory, MdRecycling, MdCloud } from "react-icons/md";

function About() {
  return (
    <section id="about" className="bg-primary text-white px-6 md:px-16 lg:px-24 py-16">
      <div className="max-w-5xl mx-auto text-center md:text-left">
        
        {/* About Us */}
        <h2 className="text-3xl md:text-4xl font-bold text-mutedSecondary">About Us</h2>
        <p className="text-mutedSecondary text-base md:text-lg mt-4 leading-relaxed">
          We are a social enterprise dedicated to tackling some of the most pressing issues facing our world today. As a social purpose-driven organization, we are addressing critical challenges such as e-waste, energy poverty, and unemployment, with the goal of creating a more sustainable future for all.
        </p>

        {/* Vision */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-mutedSecondary">Vision</h3>
          <p className="text-mutedSecondary text-base md:text-lg mt-2 leading-relaxed">
            We envision a world where transformative solutions pave the way for a sustainable future that benefits everyone.
          </p>
        </div>

        {/* Mission */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-mutedSecondary">Mission</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
              { icon: <FaLightbulb />, title: "Social Technology & Innovations", desc: "Leveraging cutting-edge solutions to address pressing social challenges." },
              { icon: <FaUsers />, title: "Empowering Individuals & Communities", desc: "Providing tools and resources that enable people to thrive." },
              { icon: <FaLeaf />, title: "Promoting Sustainable Practices", desc: "Advocating for environmentally friendly methods that protect our planet." },
              { icon: <MdOutlineElectricBolt />, title: "Clean & Affordable Energy for All", desc: "Ensuring access to sustainable energy solutions for every community." },
              { icon: <FaBalanceScale />, title: "Social Equity", desc: "Championing inclusivity and fairness in all aspects of society." },
            ].map((item, index) => (
              <div key={index} className="bg-mutedSecondary text-primary p-6 rounded-lg shadow-lg flex items-center gap-4">
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values (Cards) */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-mutedSecondary">Our Values</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {[
              { icon: <FaGlobe />, title: "Sustainability" },
              { icon: <FaLightbulb />, title: "Innovation" },
              { icon: <FaHandshake />, title: "Social Responsibility" },
              { icon: <FaBalanceScale />, title: "Integrity" },
              { icon: <FaUsers />, title: "Empowerment" },
              { icon: <FaLeaf />, title: "Diversity & Inclusion" },
            ].map((item, index) => (
              <div key={index} className="bg-mutedSecondary text-primary p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                <div className="text-4xl">{item.icon}</div>
                <h4 className="font-bold text-lg mt-2">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Global Challenges (SDGs) */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-mutedSecondary">Global Challenges We Are Tackling</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {[
              { icon: <MdOutlineElectricBolt />, title: "SDG 7" },
              { icon: <MdFactory />, title: "SDG 9" },
              { icon: <MdRecycling />, title: "SDG 12" },
              { icon: <MdCloud />, title: "SDG 13" },
            ].map((item, index) => (
              <div key={index} className="bg-mutedSecondary text-primary p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                <div className="text-4xl">{item.icon}</div>
                <h4 className="font-bold text-lg mt-2">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default About;
