import { createBrowserClient } from "@supabase/ssr";

// Add error handling for missing environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

// Singleton pattern to prevent multiple instances
let supabaseClientInstance: ReturnType<typeof createBrowserClient> | null =
  null;

export const supabaseClient = (() => {
  if (typeof window === "undefined") {
    // Server-side: return a new instance
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  if (!supabaseClientInstance) {
    supabaseClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClientInstance;
})();
