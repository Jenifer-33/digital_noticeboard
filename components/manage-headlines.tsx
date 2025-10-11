"use client";

import { useAuth } from "@/hooks/use-auth";
import type { Headline, HeadlineStatus } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HeadlineCard } from "./headline-card";
import { HeadlineForm } from "./headline-form";
import { Drawer } from "./ui/Drawer";
import { Modal } from "./ui/Modal";

export const ManageHeadlines = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<HeadlineStatus | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingHeadlineId, setEditingHeadlineId] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    setEditingHeadlineId(null);
    setShowDrawer(false);
    fetchHeadlines();
    router.push("/dashboard");
  };

  const handleCancel = () => {
    setEditingHeadlineId(null);
    setShowDrawer(false);
    router.push("/dashboard");
  };

  const handleEdit = (headlineId: string) => {
    setEditingHeadlineId(headlineId);
    setShowDrawer(true);
  };

  useEffect(() => {
    fetchHeadlines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, currentPage, searchQuery]);

  useEffect(() => {
    if (showDrawer) {
      setEditingHeadlineId(null);
    }
  }, [showDrawer]);

  const fetchHeadlines = async () => {
    try {
      // Ensuring only non-empty strings are added to the query parameters to avoid irrelevant search results
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      params.append("page", currentPage.toString());
      params.append("limit", "10");
      if (searchQuery.trim() !== "") params.append("query", searchQuery.trim());

      const response = await fetch(`/api/headlines/admin?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch headlines");

      const data = await response.json();
      setHeadlines(data.headlines);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setError("Failed to load headlines");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    headlineId: string,
    newStatus: HeadlineStatus
  ) => {
    try {
      const response = await fetch(`/api/headlines/${headlineId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          modified_by: user?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setHeadlines(
        headlines.map((h) =>
          h.id === headlineId ? { ...h, status: newStatus } : h
        )
      );
    } catch {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (headlineId: string) => {
    setEditingHeadlineId(headlineId);
    setShowModal(true);
  };

  const executeDelete = async () => {
    try {
      const response = await fetch(`/api/headlines/${editingHeadlineId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete headline");

      setHeadlines(headlines.filter((h) => h.id !== editingHeadlineId));
      setShowModal(false);
      setEditingHeadlineId(null);
    } catch {
      setError("Failed to delete headline");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-lg font-bold text-[#e66030] py-8">
        Loading headlines...
      </div>
    );
  }

  return (
    <div className="space-y-6 min-w-0 sm:min-w-full">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Headlines
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowDrawer(true)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e66030] hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Add Headline
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4 justify-between">
          <input
            id="headline-search"
            className="border-gray-300 border-2  outline-none px-3 py-2 w-1/2 rounded-md shadow-sm"
            placeholder="Search headlines"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
          />
          <div className="flex items-center space-x-2">
            <label
              htmlFor="status-filter"
              className="text-md font-medium text-black"
            >
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as HeadlineStatus | "ALL")
              }
              className="border-gray-300 border-2 rounded-md shadow-md outline-none p-2 "
            >
              <option value="ALL">All</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {headlines.map((headline) => (
          <HeadlineCard
            key={headline.id}
            headline={headline}
            showActions={true}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {showDrawer && (
        <Drawer onClose={() => setShowDrawer(false)}>
          <HeadlineForm
            id={editingHeadlineId || undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Drawer>
      )}
      {showModal && (
        <Modal
          title="Confirm Deletion"
          content="Are you sure you want to delete this headline?"
          onConfirm={executeDelete}
          confirmText="Delete"
          closeText="Cancel"
          isDelete={true}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
