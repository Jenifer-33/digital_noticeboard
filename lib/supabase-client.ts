import { createBrowserClient } from "@supabase/ssr";

// Singleton pattern to prevent multiple instances
let supabaseClientInstance: ReturnType<typeof createBrowserClient> | null =
  null;

export const supabaseClient = (() => {
  if (typeof window === "undefined") {
    // Server-side: return a new instance
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  if (!supabaseClientInstance) {
    supabaseClientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClientInstance;
})();
