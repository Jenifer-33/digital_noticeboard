"use client";
import Link from "next/link";
import { supabaseClient as supabase } from "@/lib/supabase-client";
import { useAuth } from "../../hooks/use-auth";

export const HeaderMenu = () => {
  const { user, signOut } = useAuth();

  // ✅ Old function: Show slides (update Supabase)
  async function triggerPresent() {
    try {
      const { error } = await supabase
        .from("display_signal")
        .update({ show: true })
        .eq("id", 1);

      if (error) throw error;

      // Navigate to PRESENT page like before
      window.location.href = "/present";
    } catch (err: any) {
      console.error("Error:", err.message);
      alert("❌ Failed to trigger display");
    }
  }

  // ❗ TEMPORARY STOP FUNCTION (Pi server not added yet)
  // Redirects to dashboard for now
  async function stopPresent() {
    try {
      // Update Supabase to hide slides
      const { error } = await supabase
        .from("display_signal")
        .update({ show: false })
        .eq("id", 1);

      if (error) throw error;

      alert("🛑 Stop signal sent — Pi shutdown API will be connected later.");

      // After stopping, go to dashboard
      window.location.href = "/dashboard";

      // ⛔ We will later replace this with:
      // await fetch("http://PI_IP:5000/shutdown", { method: "POST" });
    } catch (err: any) {
      console.error("Error:", err.message);
      alert("❌ Failed to stop display");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-4 sm:space-y-4 menu-links">

      {/* 🏠 Home */}
      <Link
        href="/"
        className="inline-flex items-center px-4 text-sm font-medium text-[#e66030]"
      >
        Home
      </Link>

      {/* 🔐 Admin Login */}
      {!user && (
        <Link
          href="/login"
          className="inline-flex items-center px-4 text-sm font-medium text-[#e66030]"
        >
          Admin Login
        </Link>
      )}

      {/* 📋 Dashboard */}
      {user && (
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 text-sm font-medium text-[#e66030]"
        >
          Dashboard
        </Link>
      )}

      {/* 📺 PRESENT button (same as old one) */}
      <button
        onClick={triggerPresent}
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-[#e66030] text-white"
      >
        📺 Present
      </button>

      {/* 🛑 STOP button (redirects to dashboard for now) */}
      <button
        onClick={stopPresent}
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white"
      >
        🛑 Stop
      </button>

      {/* 🚪 Logout */}
      {user && (
        <button
          onClick={() => signOut()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-md"
        >
          Logout
        </button>
      )}
    </div>
  );
};
