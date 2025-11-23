import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Bakery Palette
const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
  black: "#000000",
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    bio: "",
    profileImage: null,
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch Profile + Stats
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProfile(data);

      const statsRes = await fetch(`${API_URL}/api/users/me/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      setLoading(false);
    } catch (error) {
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/signup");
    fetchProfile();
  }, []);

  // Handle Edit Form
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      setEditForm((prev) => ({ ...prev, profileImage: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("email", editForm.email);
    formData.append("bio", editForm.bio);

    if (editForm.profileImage) {
      formData.append("profileImage", editForm.profileImage);
    }

    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated!");
        setEditModal(false);
        fetchProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // Loading Screen
  if (loading)
    return (
      <div
        className="kanit-light flex justify-center items-center min-h-screen text-xl"
        style={{ color: PALETTE.brown }}
      >
        Loading profile…
      </div>
    );

  return (
    <div
      className="kanit-light px-6 md:px-16 py-10"
      style={{ background: PALETTE.cream }}
    >
      <h1
        className="text-4xl font-bold text-center mb-10"
        style={{ color: PALETTE.brown }}
      >
        My Profile
      </h1>

      {/* Profile Card */}
      <div
        className="max-w-3xl mx-auto p-8 rounded-2xl shadow-xl"
        style={{
          background: "white",
          border: `1px solid ${PALETTE.tan}`,
        }}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src={
              profile?.profileImage
                ? `${API_URL}/${profile.profileImage}`
                : "/default-avatar.png"
            }
            className="w-32 h-32 rounded-full object-cover shadow-lg border"
            alt="Profile"
            style={{ borderColor: PALETTE.tan }}
          />

          <h2
            className="text-2xl font-bold mt-4"
            style={{ color: PALETTE.brown }}
          >
            {profile?.name}
          </h2>
          <p className="text-gray-600">{profile?.email}</p>

          {profile?.bio && (
            <p className="text-gray-700 mt-2 italic">{profile.bio}</p>
          )}

          {/* Edit Button */}
          <button
            onClick={() => {
              setEditModal(true);
              setEditForm({
                name: profile.name,
                email: profile.email,
                bio: profile.bio || "",
                profileImage: null,
              });
            }}
            className="px-5 py-2 rounded-xl shadow mt-5"
            style={{
              background: PALETTE.brown,
              color: "white",
            }}
          >
            ✏️ Edit Profile
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            { label: "Recipes Created", value: stats?.totalRecipes },
            { label: "Total Likes", value: stats?.totalLikes },
            { label: "Favorites Received", value: stats?.totalFavorites },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl shadow text-center"
              style={{
                background: PALETTE.beige,
                border: `1px solid ${PALETTE.tan}`,
              }}
            >
              <h3 className="text-3xl font-bold" style={{ color: PALETTE.brown }}>
                {stat.value}
              </h3>
              <p className="text-gray-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
            style={{ border: `1px solid ${PALETTE.tan}` }}
          >
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: PALETTE.brown }}
            >
              Edit Profile
            </h2>

            <label className="font-semibold" style={{ color: PALETTE.brown }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              className="input input-bordered w-full mb-3"
            />

            <label className="font-semibold" style={{ color: PALETTE.brown }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              className="input input-bordered w-full mb-3"
            />

            <label className="font-semibold" style={{ color: PALETTE.brown }}>
              Bio
            </label>
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={handleEditChange}
              className="textarea textarea-bordered w-full mb-3"
            />

            <label className="font-semibold" style={{ color: PALETTE.brown }}>
              Profile Image
            </label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleEditChange}
              className="file-input file-input-bordered w-full mb-4"
            />

            {/* Preview */}
            {editForm.profileImage && (
              <img
                src={URL.createObjectURL(editForm.profileImage)}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow"
              />
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setEditModal(false)}
                className="px-4 py-2 rounded-xl"
                style={{
                  border: `1px solid ${PALETTE.tan}`,
                  color: PALETTE.brown,
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-white"
                style={{ background: PALETTE.brown }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
