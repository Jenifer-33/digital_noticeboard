"use client";

import Link from "next/link";
import { supabaseClient as supabase } from "@/lib/supabase-client";
import { useAuth } from "../../hooks/use-auth";

export const HeaderMenu = () => {
  const { user, signOut } = useAuth();

  // ✅ Trigger display on Raspberry Pi (set show = true)
  async function triggerPresent() {
    try {
      const { error } = await supabase
        .from("display_signal")
        .update({ show: true })
        .eq("id", 1);

      if (error) throw error;
      alert("Display triggered successfully ✅");
    } catch (err: any) {
      console.error("Error triggering display:", err.message);
      alert("❌ Failed to trigger display");
    }
  }

  // ✅ Stop display on Raspberry Pi (set show = false)
  async function stopPresent() {
    try {
      const { error } = await supabase
        .from("display_signal")
        .update({ show: false })
        .eq("id", 1);

      if (error) throw error;
      alert("Display stopped successfully 🛑");
    } catch (err: any) {
      console.error("Error stopping display:", err.message);
      alert("❌ Failed to stop display");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center md:items-center space-x-4 sm:space-y-4 menu-links">
      {/* 🏠 Home */}
      <Link
        href="/"
        className="inline-flex items-center px-4 mb-0 sm:mb-4 text-sm font-medium text-[#e66030] hover:border-b-2 focus:outline-none outline-none"
      >
        Home
      </Link>

      {/* 🔐 Login */}
      {!user && (
        <Link
          href="/login"
          className="inline-flex items-center px-4 mb-0 sm:mb-4 text-sm font-medium text-[#e66030] hover:border-b-2"
        >
          Admin Login
        </Link>
      )}

      {/* 📋 Dashboard */}
      {user && (
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 mb-0 sm:mb-4 text-sm font-medium text-[#e66030] hover:border-b-2"
        >
          Dashboard
        </Link>
      )}

      {/* 📺 PRESENT BUTTON */}
      {user && (
        <button
          onClick={triggerPresent}
          className="inline-flex items-center px-4 py-2 sm:mb-4 border border-transparent text-sm font-medium rounded-md bg-[#e66030] hover:border-b-2 outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          📺 Present
        </button>
      )}

      {/* 🛑 STOP DISPLAY BUTTON */}
      {user && (
        <button
          onClick={stopPresent}
          className="inline-flex items-center px-4 py-2 sm:mb-4 border border-transparent text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          🛑 Stop Display
        </button>
      )}

      {/* 🚪 LOGOUT */}
      {user && (
        <button
          onClick={() => signOut()}
          className="inline-flex cursor-pointer items-center px-4 mb-0 py-2 sm:mb-4 text-sm font-medium border border-transparent text-red-500 hover:border-2 rounded-md hover:border-red-500"
        >
          Logout
        </button>
      )}
    </div>
  );
};
