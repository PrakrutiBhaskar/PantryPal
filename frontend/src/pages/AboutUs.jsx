import React from "react";
import backgroundImage from "../assets/background.jpg"; // ✅ MUST BE FIRST

const PALETTE = {
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  brown: "#B57655",
  beige: "#F3D79E",
};

const AboutUs = () => {
  return (
    <div>
      {/* Soft overlay */}
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{
          background: "rgba(242, 227, 198, 0.65)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Glass Card */}
        <div
          className="max-w-5xl mx-auto p-10 rounded-3xl shadow-2xl relative"
          style={{
            background: "rgba(255,255,255,0.78)",
            border: `1px solid ${PALETTE.tan}`,
            backdropFilter: "blur(12px)",
          }}
        >
          <h1
            className="text-4xl font-bold text-center mb-8"
            style={{ color: PALETTE.brown }}
          >
            About PantryPal
          </h1>

          <p className="text-gray-800 text-lg leading-8 mb-8 text-center max-w-3xl mx-auto">
            PantryPal is your smart, personalized kitchen companion — helping you
            discover recipes, track ingredients, reduce food waste, and cook
            with confidence.
            <br />
            We believe cooking should be simple, inspiring, and accessible for
            everyone.
          </p>

          {/* Sections */}
          <div className="mt-12 grid md:grid-cols-2 gap-10">
            {/* Mission */}
            <div
              className="p-6 rounded-xl shadow-md"
              style={{
                background: "white",
                border: `1px solid ${PALETTE.tan}`,
              }}
            >
              <h2
                className="text-2xl font-semibold mb-3"
                style={{ color: PALETTE.brown }}
              >
                Our Mission 🌱
              </h2>
              <p className="text-gray-700 leading-7">
                Our mission is to help people cook effortlessly using what they
                already have—minimizing waste and maximizing creativity.  
                PantryPal simplifies home cooking with smart recommendations,
                diet filters, and personalized recipe boards.
              </p>
            </div>

            {/* Vision */}
            <div
              className="p-6 rounded-xl shadow-md"
              style={{
                background: "white",
                border: `1px solid ${PALETTE.tan}`,
              }}
            >
              <h2
                className="text-2xl font-semibold mb-3"
                style={{ color: PALETTE.brown }}
              >
                Our Vision 🌟
              </h2>
              <p className="text-gray-700 leading-7">
                Our vision is to become the most intuitive digital kitchen
                assistant, blending creativity with technology to help you cook
                confidently and comfortably—no matter your skill level.
              </p>
            </div>

            {/* Features */}
            <div
              className="p-6 rounded-xl shadow-md col-span-full"
              style={{
                background: "white",
                border: `1px solid ${PALETTE.tan}`,
              }}
            >
              <h2
                className="text-2xl font-semibold mb-4 text-center"
                style={{ color: PALETTE.brown }}
              >
                What We Offer 🍽️
              </h2>

              <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                <li className="p-3 rounded-lg bg-[rgba(0,0,0,0.03)]">
                  ✔ Smart recipe recommendations
                </li>
                <li className="p-3 rounded-lg bg-[rgba(0,0,0,0.03)]">
                  ✔ Dietary-based filtering
                </li>
                <li className="p-3 rounded-lg bg-[rgba(0,0,0,0.03)]">
                  ✔ Ingredient tracking
                </li>
                <li className="p-3 rounded-lg bg-[rgba(0,0,0,0.03)]">
                  ✔ Personal recipe collections
                </li>
                <li className="p-3 rounded-lg bg-[rgba(0,0,0,0.03)]">
                  ✔ Favorites & likes tracking
                </li>
                <li className="p-3 rounded-lg bg-[rgba(0,0,0,0.03)]">
                  ✔ A community recipe hub (coming soon)
                </li>
              </ul>
            </div>

            {/* Team */}
            <div
              className="p-6 rounded-xl shadow-md col-span-full text-center"
              style={{
                background: "white",
                border: `1px solid ${PALETTE.tan}`,
              }}
            >
              <h2
                className="text-2xl font-semibold mb-3"
                style={{ color: PALETTE.brown }}
              >
                Our Team 👩🏻‍🍳👨🏻‍🍳
              </h2>
              <p className="text-gray-700 leading-7 max-w-3xl mx-auto">
                PantryPal is developed by passionate food lovers and creators
                who want to bring joy and simplicity to your daily meals.
                <br />
                We are constantly improving and adding smart cooking features!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;