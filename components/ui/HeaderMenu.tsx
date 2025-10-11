import Link from "next/link";

import { useAuth } from "../../hooks/use-auth";

export const HeaderMenu = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center md:items-center space-x-4 sm:space-y-4 menu-links">
      <Link
        href="/"
        className="inline-flex items-center px-4 mb-0 sm:mb-4  text-sm font-medium   text-[#e66030] hover:border-b-2 focus:outline-none outline-none  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        Home
      </Link>
      {!user && (
        <Link
          href="/login"
          className="inline-flex items-center px-4 mb-0 sm:mb-4  text-sm font-medium  text-[#e66030] hover:border-b-2 outline-none  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Admin Login
        </Link>
      )}
      {user && (
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 mb-0 sm:mb-4  text-sm font-medium  text-[#e66030] hover:border-b-2  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Dashboard
        </Link>
      )}
      <Link
        href="/present"
        className="inline-flex items-center px-4 py-2 sm:mb-4  border border-transparent text-sm font-medium rounded-md bg-[#e66030] hover:border-b-2 outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        📺 Present
      </Link>
      {user && (
        <button
          onClick={() => signOut()}
          className="inline-flex cursor-pointer items-center px-4 mb-0 py-2 sm:mb-4  text-sm font-medium border border-transparent text-red-500 hover:border-2 rounded-md hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Logout
        </button>
      )}
    </div>
  );
};
