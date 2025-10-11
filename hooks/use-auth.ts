import { isAdminAtom, isLoadingAtom, userAtom } from "@/lib/atoms";
import { supabaseClient } from "@/lib/supabase-client";
import type { User } from "@/lib/types";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const router = useRouter();
  const loadingProfileRef = useRef<string | null>(null);
  const retryCountRef = useRef<number>(0);
  const initialSessionLoadedRef = useRef<boolean>(false);
  const maxRetries = 3;

  const loadUserProfile = useCallback(
    async (userId: string, retryCount = 0) => {
      // Prevent duplicate profile loads for the same user
      if (loadingProfileRef.current === userId) {
        console.log("Profile load already in progress for user:", userId);
        return;
      }

      console.log(
        `Loading user profile for: ${userId} (attempt ${retryCount + 1})`
      );
      loadingProfileRef.current = userId;

      try {
        // Increased timeout to 15 seconds for better reliability
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("User profile load timeout")),
            15000
          )
        );

        const profilePromise = supabaseClient
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        console.log("Making user profile query...");
        const { data, error } = await Promise.race([
          profilePromise,
          timeoutPromise,
        ]);
        console.log("User profile query result:", { data, error });

        if (error) {
          console.error("Error loading user profile:", error);

          // Only retry for network/timeout errors, not for user not found
          if (
            retryCount < maxRetries &&
            (error.message?.includes("timeout") ||
              error.message?.includes("network") ||
              error.message?.includes("fetch"))
          ) {
            console.log(
              `Retrying profile load (attempt ${retryCount + 1}/${maxRetries})`
            );
            setTimeout(() => {
              loadUserProfile(userId, retryCount + 1);
            }, 1000 * (retryCount + 1)); // Exponential backoff
            return;
          }

          // If user not found or max retries exceeded, clear user
          if (error.code === "PGRST116" || retryCount >= maxRetries) {
            console.log(
              "User not found or max retries exceeded, clearing user"
            );
            setUser(null);
          }
        } else {
          console.log("User profile loaded successfully:", data);
          setUser(data as User);
          retryCountRef.current = 0; // Reset retry count on success
        }
      } catch (error) {
        console.error("Error loading user profile:", error);

        // Retry for timeout errors
        if (
          retryCount < maxRetries &&
          error instanceof Error &&
          error.message.includes("timeout")
        ) {
          console.log(
            `Retrying profile load after timeout (attempt ${
              retryCount + 1
            }/${maxRetries})`
          );
          setTimeout(() => {
            loadUserProfile(userId, retryCount + 1);
          }, 1000 * (retryCount + 1)); // Exponential backoff
          return;
        }

        // Only clear user if we've exhausted retries or it's a non-retryable error
        if (
          retryCount >= maxRetries ||
          !(error instanceof Error && error.message.includes("timeout"))
        ) {
          console.log(
            "Max retries exceeded or non-retryable error, clearing user"
          );
          setUser(null);
        }
      } finally {
        console.log("Setting loading to false");
        setIsLoading(false);
        loadingProfileRef.current = null;
      }
    },
    [setUser, setIsLoading]
  );

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Auth loading timeout - setting loading to false");
        setIsLoading(false);
      }
    }, 10000); // Increased to 10 seconds

    // Get initial session
    const getInitialSession = async () => {
      console.log("Getting initial session...");
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        console.log("Initial session:", session);
        if (session?.user) {
          console.log("User found, loading profile for:", session.user.id);
          initialSessionLoadedRef.current = true;
          await loadUserProfile(session.user.id);
        } else {
          console.log("No session found, setting loading to false");
          setIsLoading(false);
          initialSessionLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setIsLoading(false);
        initialSessionLoadedRef.current = true;
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log("Auth state change:", event, session?.user?.id);

        // Skip SIGNED_IN events during initial load to prevent race conditions
        if (event === "SIGNED_IN" && !initialSessionLoadedRef.current) {
          console.log("Skipping SIGNED_IN event during initial session load");
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setIsLoading(false);
          loadingProfileRef.current = null;
          retryCountRef.current = 0;
        }
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [setUser, setIsLoading, loadUserProfile, isLoading]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
    router.push("/");
  };

  return {
    user,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };
};
