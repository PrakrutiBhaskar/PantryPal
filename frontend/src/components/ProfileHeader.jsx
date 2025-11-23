import React from "react";

const colors = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
};

export default function ProfileHeader({ user }) {
  return (
    <div
      className="w-full py-10 px-6 rounded-xl shadow-md"
      style={{
        background: `linear-gradient(135deg, ${colors.cream}, ${colors.tan})`,
      }}
    >
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
        
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={
              user?.profileImage
                ? `${import.meta.env.VITE_API_URL}/${user.profileImage}`
                : "/default-avatar.png"
            }
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover shadow-md border-4"
            style={{ borderColor: colors.brown }}
          />

          {/* Outline Glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 20px ${colors.brown}55`,
            }}
          ></div>
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-4xl font-bold"
            style={{ color: colors.brown }}
          >
            {user?.name}
          </h1>

          <p
            className="text-lg"
            style={{ color: colors.caramel }}
          >
            {user?.email}
          </p>

          {/* Edit Button */}
          <button
            className="px-4 py-2 rounded-lg font-medium mt-2"
            style={{
              backgroundColor: colors.beige,
              color: colors.brown,
              border: `2px solid ${colors.caramel}`,
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
