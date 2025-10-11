"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase-client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get("code");

        if (!code) {
          setError("No confirmation code provided");
          setIsLoading(false);
          return;
        }

        // Exchange the code for a session
        const { data, error: exchangeError } =
          await supabaseClient.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("Auth callback error:", exchangeError);
          setError("Failed to confirm email. Please try logging in manually.");
          setIsLoading(false);
          return;
        }

        if (data.session) {
          // Check if user is admin
          const { data: userData } = await supabaseClient
            .from("users")
            .select("role")
            .eq("id", data.session.user.id)
            .single();

          if (userData?.role === "admin") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        } else {
          setError("No session created. Please try logging in manually.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setError(
          "An unexpected error occurred. Please try logging in manually."
        );
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Confirming your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Email Confirmation Failed
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try Login Instead
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
