"use client";

import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { Modal } from "./ui/Modal";

export const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch {
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !currentUser) return;

    setIsInviting(true);
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          createdBy: currentUser.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to send invite");

      const data = await response.json();
      alert(`Invite sent! Link: ${data.inviteLink}`);
      setInviteEmail("");
    } catch {
      setError("Failed to send invite");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "admin" | "user"
  ) => {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      setError("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeleteUserId(userId);
    setShowModal(true);
  };

  const executeDelete = async () => {
    try {
      const response = await fetch(`/api/users/${deleteUserId}/role`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((u) => u.id !== deleteUserId));
      setShowModal(false);
      setDeleteUserId(null);
    } catch {
      setError("Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-lg font-bold text-[#e66030]">
        Loading users...
      </div>
    );
  }

  const getRoleColor = (role: "admin" | "user") => {
    switch (role) {
      case "admin":
        return "bg-green-100 text-green-800 border-green-300";
      case "user":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6  min-w-full">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Users
          </h2>
        </div>
      </div>

      {/* Invite form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Admin</h3>
        <form onSubmit={handleInvite} className="flex gap-4">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isInviting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e66030] hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {isInviting ? "Sending..." : "Send Invite"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(
                        user.id,
                        e.target.value as "admin" | "user"
                      )
                    }
                    className={
                      "text-sm border-2 p-1 outline-none text-white rounded-md cursor-pointer " +
                      getRoleColor(user.role)
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showModal && (
        <Modal
          title="Confirm Deletion"
          content="Are you sure you want to delete this user?"
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
