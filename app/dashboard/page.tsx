"use client";

import { AdminOnlyWrapper } from "@/components/admin-only-wrapper";
import { Header } from "@/components/ui/Header";
import { useState } from "react";
import { ManageHeadlines } from "../../components/manage-headlines";
import { ManageUsers } from "../../components/manage-users";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"headlines" | "users">(
    "headlines"
  );

  return (
    <AdminOnlyWrapper>
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="flex flex-col flex-1">
            <main className="flex-1">
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  <ul className="flex flex-wrap justify-center text-sm font-medium text-center text-gray-500 border-b border-[#e66030]">
                    <li className="me-2">
                      <a
                        onClick={() => setActiveTab("headlines")}
                        aria-current="page"
                        className={
                          "inline-block p-4 text-[#e66030] bg-gray-100 rounded-t-lg" +
                          (activeTab === "headlines"
                            ? " dark:bg-[#e66030] dark:text-white"
                            : "text-[#e66030] hover:bg-[#e66030] hover:text-white rounded-t-md font-bold")
                        }
                      >
                        Headlines
                      </a>
                    </li>
                    <li className="me-2">
                      <a
                        onClick={() => setActiveTab("users")}
                        className={
                          "inline-block p-4 text-[#e66030] bg-gray-100 rounded-t-lg" +
                          (activeTab === "users"
                            ? " dark:bg-[#e66030] dark:text-white"
                            : "text-[#e66030] hover:bg-[#e66030] hover:text-white rounded-t-md font-bold")
                        }
                      >
                        Users
                      </a>
                    </li>
                  </ul>
                  <div className="flex items-center justify-center mt-5">
                    {activeTab === "headlines" && <ManageHeadlines />}
                    {activeTab === "users" && <ManageUsers />}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </AdminOnlyWrapper>
  );
}
