import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

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

  // Fetch profile + stats
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
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/signup");
    fetchProfile();
  }, []);

  // Handle form field changes
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setEditForm((prev) => ({
        ...prev,
        profileImage: files[0],
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit updated profile
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
      console.error(error);
      toast.error("Update failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading profile...
      </div>
    );

  return (
    <div className="px-5 md:px-16 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <img
            src={
                profile?.profileImage
                ? `${API_URL}/${profile.profileImage}`
                : "/default-avatar.png"
            }
            className="w-28 h-28 rounded-full object-cover shadow"
            alt="profile"
            />

          <h2 className="text-2xl font-bold mt-4">{profile?.name}</h2>
            <p className="text-gray-500">{profile?.email}</p>

            {profile?.bio && (
            <p className="text-gray-600 mt-2">{profile.bio}</p>
            )}


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
            className="btn btn-primary mt-5"
          >
            ✏️ Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5 mt-8 text-center">
          <div className="bg-gray-100 p-5 rounded-lg shadow">
            <h3 className="text-xl font-bold">{stats?.totalRecipes}</h3>
            <p className="text-gray-600">Recipes Created</p>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg shadow">
            <h3 className="text-xl font-bold">{stats?.totalLikes}</h3>
            <p className="text-gray-600">Total Likes</p>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg shadow">
            <h3 className="text-xl font-bold">{stats?.totalFavorites}</h3>
            <p className="text-gray-600">Favorites Received</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            <label className="block font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              className="input input-bordered w-full mb-3"
            />

            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              className="input input-bordered w-full mb-3"
            />

            <label className="block font-semibold">Bio</label>
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={handleEditChange}
              className="textarea textarea-bordered w-full mb-3"
            />

            <label className="block font-semibold">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleEditChange}
              className="file-input file-input-bordered w-full mb-4"
            />

            {/* Live preview */}
            {editForm.profileImage && (
              <img
                className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                src={URL.createObjectURL(editForm.profileImage)}
              />
            )}

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setEditModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
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
