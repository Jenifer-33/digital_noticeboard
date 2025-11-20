"use client";
import Link from "next/link";
import { supabaseClient as supabase } from "@/lib/supabase-client";
import { useAuth } from "../../hooks/use-auth";

export const HeaderMenu = () => {
  const { user, signOut } = useAuth();

  // ✅ PRESENT BUTTON — same as before
  async function triggerPresent() {
    try {
      const { error } = await supabase
        .from("display_signal")
        .update({ show: true })
        .eq("id", 1);

      if (error) throw error;

      window.location.href = "/present";
    } catch (err: any) {
      console.error("Error:", err.message);
      alert("❌ Failed to trigger display");
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

      {/* 📺 PRESENT Button */}
      <button
        onClick={triggerPresent}
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-[#e66030] text-white"
      >
        📺 Present
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
