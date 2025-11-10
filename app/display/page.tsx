"use client";

import { useEffect, useState } from "react";

// Fetch data from your Supabase or API endpoint
export default function DisplayPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notices from your existing endpoint or Supabase table
    async function fetchData() {
      try {
        const res = await fetch("/api/getNotices"); // Change if your API route differs
        const data = await res.json();
        setNotices(data);
      } catch (error) {
        console.error("Error loading notices:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Optional: auto-refresh every 30 sec for live updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔒 Hide all UI / prevent going back
  useEffect(() => {
    // Disable back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">
        📺 Campus Notice Board
      </h1>
      {notices.length === 0 ? (
        <p>No active notices</p>
      ) : (
        <div className="grid gap-4 w-full max-w-3xl">
          {notices.map((notice, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-orange-600 p-4 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2">{notice.title}</h2>
              <p className="text-gray-300">{notice.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
