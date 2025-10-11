import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { HeaderMenu } from "./HeaderMenu";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={` justify-between items-center py-2 ${
            menuOpen ? "flex flex-col" : ""
          }`}
        >
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo.png"
                alt="Notice Board"
                width={50}
                height={50}
              />
              <div>
                <h1 className="text-2xl font-bold text-[#e66030]">
                  CampusBoard
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Stay updated with the latest announcements
                </p>
              </div>
            </div>
            <div>
              <div className="hidden sm:block">
                <HeaderMenu />
              </div>
              <div className="sm:hidden">
                <button
                  className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  {menuOpen ? (
                    <XIcon className="w-6 h-6 text-[#e66030]" />
                  ) : (
                    <MenuIcon className="w-6 h-6 text-[#e66030]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {menuOpen && <HeaderMenu />}
      </div>
    </header>
  );
};
