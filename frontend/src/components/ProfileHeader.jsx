import React from "react";

const colors = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function ProfileHeader({ user, onEdit }) {
  const profileImg = user?.profileImage
    ? `${API_URL}/${user.profileImage}`
    : "/default-avatar.png";

  return (
    <div
      className="w-full py-10 px-6 rounded-xl shadow-md kanit-light"
      style={{
        background: `linear-gradient(135deg, ${colors.cream}, ${colors.tan})`,
      }}
    >
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">

        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <img
            src={profileImg}
            alt="Profile"
            onError={(e) => (e.target.src = "/default-avatar.png")}
            className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4"
            style={{ borderColor: colors.brown }}
          />

          {/* Soft Glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: `0 0 25px ${colors.brown}55`,
            }}
          ></div>
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1
            className="text-4xl font-bold break-words"
            style={{ color: colors.brown }}
          >
            {user?.name || "User"}
          </h1>

          <p className="text-lg" style={{ color: colors.caramel }}>
            {user?.email}
          </p>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="px-5 py-2 rounded-lg font-medium mt-3 transition shadow"
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
