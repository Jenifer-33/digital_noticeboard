// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useAuth } from "@/hooks/use-auth";

// const signupSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type SignupForm = z.infer<typeof signupSchema>;

// function AdminOnboardingContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");
//   const { signUp } = useAuth();

//   const [isFirstAdmin, setIsFirstAdmin] = useState<boolean | null>(null);
//   const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
//   const [inviteEmail, setInviteEmail] = useState<string>("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignupForm>({
//     resolver: zodResolver(signupSchema),
//   });

//   useEffect(() => {
//     const checkAdminStatus = async () => {
//       try {
//         if (token) {
//           // Validate invite token
//           const response = await fetch(`/api/invite/validate?token=${token}`);
//           const data = await response.json();
//           setIsValidToken(data.valid);
//           setInviteEmail(data.email || "");
//         } else {
//           // Check if any admins exist
//           const response = await fetch("/api/admin/check-first");
//           const data = await response.json();
//           setIsFirstAdmin(data.hasAdmins === false);
//         }
//       } catch (error) {
//         console.error("Error checking admin status:", error);
//         setError("Failed to verify admin status");
//       }
//     };

//     checkAdminStatus();
//   }, [token]);

//   const onSubmit = async (data: SignupForm) => {
//     setIsLoading(true);
//     setError("");

//     try {
//       // Sign up the user
//       const { error: signUpError } = await signUp(data.email, data.password);

//       if (signUpError) {
//         setError(signUpError.message);
//         return;
//       }

//       // Get the current user ID
//       const {
//         data: { user },
//       } = await (
//         await import("@/lib/supabase-client")
//       ).supabaseClient.auth.getUser();

//       if (!user) {
//         setError("Failed to get user information");
//         return;
//       }

//       // Set user as admin
//       const response = await fetch("/api/admin/setup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user.id,
//           role: "admin",
//         }),
//       });

//       if (!response.ok) {
//         setError("Failed to set admin role");
//         return;
//       }

//       // Mark invite as used if it was a token signup
//       if (token) {
//         await fetch("/api/invite/validate", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token, used: true }),
//         });
//       }

//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Signup error:", error);
//       setError("An unexpected error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isFirstAdmin === null && isValidToken === null) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">Loading...</div>
//       </div>
//     );
//   }

//   if (token && !isValidToken) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">
//             Invalid Invite
//           </h1>
//           <p className="text-gray-600">
//             This invite link is invalid or has expired.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!token && !isFirstAdmin) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">
//             Admin Access Required
//           </h1>
//           <p className="text-gray-600">
//             You need an admin invite to create an account.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900">
//             {token ? "Complete Admin Setup" : "Create First Admin"}
//           </h2>
//           <p className="mt-2 text-gray-600">
//             {token
//               ? `Create your admin account for ${inviteEmail}`
//               : "Set up the first admin account for this notice board"}
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email address
//             </label>
//             <input
//               {...register("email")}
//               type="email"
//               autoComplete="email"
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               placeholder={inviteEmail || "Enter your email"}
//               defaultValue={inviteEmail}
//             />
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               {...register("password")}
//               type="password"
//               autoComplete="new-password"
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter your password"
//             />
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {error && (
//             <div className="text-red-600 text-sm text-center">{error}</div>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//           >
//             {isLoading ? "Creating Account..." : "Create Admin Account"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default function AdminOnboardingPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center">Loading...</div>
//         </div>
//       }
//     >
//       <AdminOnboardingContent />
//     </Suspense>
//   );
// }

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

function AdminOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { signUp } = useAuth();

  const [isFirstAdmin, setIsFirstAdmin] = useState<boolean | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (token) {
          const response = await fetch(`/api/invite/validate?token=${token}`);
          const data = await response.json();
          setIsValidToken(data.valid);
          setInviteEmail(data.email || "");
        } else {
          const response = await fetch("/api/admin/check-first");
          const data = await response.json();
          setIsFirstAdmin(data.hasAdmins === false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setError("Failed to verify admin status");
      }
    };

    checkAdminStatus();
  }, [token]);

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setError("");

    try {
      const { error: signUpError } = await signUp(data.email, data.password);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const {
        data: { user },
      } = await (
        await import("@/lib/supabase-client")
      ).supabaseClient.auth.getUser();

      if (!user) {
        setError("Failed to get user information");
        return;
      }

      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          role: "admin",
        }),
      });

      if (!response.ok) {
        setError("Failed to set admin role");
        return;
      }

      if (token) {
        await fetch("/api/invite/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, used: true }),
        });
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFirstAdmin === null && isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (token && !isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invalid Invite
          </h1>
          <p className="text-gray-600">This invite link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (!token && !isFirstAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Admin Access Required
          </h1>
          <p className="text-gray-600">
            You need an admin invite to create an account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {token ? "Complete Admin Setup" : "Create First Admin"}
          </h2>
          <p className="mt-2 text-gray-600">
            {token
              ? `Create your admin account for ${inviteEmail}`
              : "Set up the first admin account"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              defaultValue={inviteEmail}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              autoComplete="new-password"
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            {isLoading ? "Creating Account..." : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <AdminOnboardingContent />
    </Suspense>
  );
}
