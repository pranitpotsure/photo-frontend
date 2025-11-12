import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCloudUploadAlt,
  FaImages,
  FaUserCircle,
  FaTrashAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMeta, setShowMeta] = useState(null);
  const BACKEND_URL = "https://photos.keypress.shop";

  // Fetch photos
  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/photos`);
      setPhotos(res.data);
    } catch (err) {
      console.error("Error fetching photos:", err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Upload photo
  const uploadPhoto = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Uploaded successfully!");
      setSelectedFile(null);
      fetchPhotos();
    } catch (err) {
      console.error("Error uploading photo:", err);
      alert("❌ Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // Delete photo
  const deletePhoto = async (id) => {
    const confirmDelete = window.confirm(
      "🗑️ Are you sure you want to delete this photo?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BACKEND_URL}/photos/${id}`);
      alert("🗑️ Photo deleted successfully!");
      fetchPhotos(); // refresh gallery
    } catch (err) {
      console.error("Error deleting photo:", err);
      alert("❌ Failed to delete photo.");
    }
  };

  // Chart data
  const uploadData = photos.reduce((acc, photo) => {
    const month = new Date(photo.created_at).toLocaleString("default", {
      month: "short",
    });
    const found = acc.find((d) => d.month === month);
    if (found) found.uploads += 1;
    else acc.push({ month, uploads: 1 });
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white/20 backdrop-blur-lg text-white p-6 flex flex-col justify-between shadow-2xl hidden md:flex">
        <div>
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaImages /> Photo Stats
          </h1>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={uploadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff40" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ background: "#fff", borderRadius: "10px" }}
                labelStyle={{ color: "#000" }}
              />
              <Bar dataKey="uploads" fill="#ffcc00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-center text-white/80 mt-4">
          © {new Date().getFullYear()} Pranit’s PhotoApp 📸
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 bg-white/10 backdrop-blur-md p-8 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
          <div className="flex items-center gap-6">
            <FaUserCircle className="text-6xl text-white drop-shadow-md" />
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow">
                Pranit Potsure
              </h1>
              <p className="text-white/80">📍 India | Cloud and DevOps Enthusiast</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-10 mt-6 md:mt-0">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{photos.length}</p>
              <p className="text-sm text-white/80">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {120 + photos.length}
              </p>
              <p className="text-sm text-white/80">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {photos.length * 2}
              </p>
              <p className="text-sm text-white/80">Likes</p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={uploadPhoto}
          className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="block w-full max-w-sm text-sm text-gray-900 bg-white rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            <FaCloudUploadAlt /> {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((p) => (
            <div
              key={p.id}
              className="relative group rounded-xl overflow-hidden shadow-lg border border-white/20 hover:scale-105 transition-transform"
            >
              <img
                src={p.url}
                alt={p.filename}
                className="w-full h-64 object-cover group-hover:opacity-90 cursor-pointer"
                onClick={() => setShowMeta(p)}
              />

              {/* Delete button */}
              <button
                onClick={() => deletePhoto(p.id)}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                title="Delete photo"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Modal for metadata */}
      {showMeta && (
        <div
          onClick={() => setShowMeta(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] max-w-[90%] text-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              📸 Photo Details
            </h2>
            <img
              src={showMeta.url}
              alt={showMeta.filename}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <p>
              <strong>Filename:</strong> {showMeta.filename}
            </p>
            <p>
              <strong>Uploaded:</strong>{" "}
              {new Date(showMeta.created_at).toLocaleString()}
            </p>
            <p>
              <strong>URL:</strong>{" "}
              <a
                href={showMeta.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline break-all"
              >
                {showMeta.url}
              </a>
            </p>
            <button
              onClick={() => setShowMeta(null)}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
