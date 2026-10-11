"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "@/api/auth";
import { User, CreateUserPayload, UpdateUserPayload } from "@/types";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import {
  UserPlus,
  Key,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Users,
  RefreshCw,
  Lock,
  UserCheck,
} from "lucide-react";

export default function UserManagementPage() {
  const queryClient = useQueryClient();

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Active selected user for edit/reset/delete
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states for Create User
  const [createForm, setCreateForm] = useState<CreateUserPayload>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_type: "teacher",
    is_active: true,
    is_blacklisted: false,
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  // Form states for Edit User
  const [editForm, setEditForm] = useState<UpdateUserPayload>({
    first_name: "",
    last_name: "",
    email: "",
    user_type: "",
    is_active: true,
    is_blacklisted: false,
  });

  // Form states for Reset Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Fetch Users Query
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  // Filter users client-side for ultra-fast, responsive UI
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
      const email = (u.email || "").toLowerCase();
      const term = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !term || fullName.includes(term) || email.includes(term);

      const matchesRole =
        roleFilter === "all" ||
        (u.user_type || "").toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.is_active && !u.is_blacklisted) ||
        (statusFilter === "inactive" && !u.is_active) ||
        (statusFilter === "blacklisted" && u.is_blacklisted);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Quick statistics calculation
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.is_active && !u.is_blacklisted).length;
    const admins = users.filter(
      (u) => (u.user_type || "").toLowerCase() === "admin"
    ).length;
    const staffAndTeachers = users.filter((u) => {
      const type = (u.user_type || "").toLowerCase();
      return type === "teacher" || type === "staff";
    }).length;

    return { total, active, admins, staffAndTeachers };
  }, [users]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      toast.success("User created successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsCreateOpen(false);
      setCreateForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        user_type: "teacher",
        is_active: true,
        is_blacklisted: false,
      });
      setShowCreatePassword(false);
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditOpen(false);
      setSelectedUser(null);
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Failed to update user");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      resetUserPassword(id, { password }),
    onSuccess: () => {
      toast.success("Password reset successfully!");
      setIsResetOpen(false);
      setSelectedUser(null);
      setNewPassword("");
      setConfirmPassword("");
      setShowResetPassword(false);
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Failed to reset password");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteOpen(false);
      setSelectedUser(null);
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Failed to delete user");
    },
  });

  // Handlers to open modals
  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      user_type: user.user_type || "teacher",
      is_active: user.is_active ?? true,
      is_blacklisted: user.is_blacklisted ?? false,
    });
    setIsEditOpen(true);
  };

  const handleOpenReset = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setShowResetPassword(false);
    setIsResetOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Submit handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.first_name.trim() || !createForm.last_name.trim()) {
      toast.error("First name and last name are required");
      return;
    }
    if (!createForm.email.trim() || !createForm.email.includes("@")) {
      toast.error("A valid email address is required");
      return;
    }
    if (!createForm.password || createForm.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (!createForm.user_type.trim()) {
      toast.error("Please select a user role");
      return;
    }
    createMutation.mutate(createForm);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!editForm.first_name?.trim() || !editForm.last_name?.trim()) {
      toast.error("First name and last name are required");
      return;
    }
    if (!editForm.email?.trim() || !editForm.email.includes("@")) {
      toast.error("A valid email address is required");
      return;
    }
    updateMutation.mutate({
      id: selectedUser.id,
      payload: editForm,
    });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    resetPasswordMutation.mutate({
      id: selectedUser.id,
      password: newPassword,
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getRoleBadge = (role?: string) => {
    const r = (role || "").toLowerCase();
    switch (r) {
      case "admin":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
            Admin
          </span>
        );
      case "teacher":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            Teacher
          </span>
        );
      case "staff":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
            Staff
          </span>
        );
      case "student":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Student
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 capitalize">
            {role || "User"}
          </span>
        );
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.is_blacklisted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Blacklisted
        </span>
      );
    }
    if (user.is_active) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
        Inactive
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create new users, update user credentials, and reset passwords directly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition disabled:opacity-50"
            title="Refresh user list"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg shadow-sm hover:bg-brand-600 transition"
          >
            <UserPlus size={18} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Accounts
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.total}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Users size={22} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Active Users
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.active}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Administrators
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {stats.admins}
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <Shield size={22} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Teachers & Staff
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {stats.staffAndTeachers}
            </p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <UserCheck size={22} />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Role:
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>

          {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
              className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/75 dark:bg-gray-900/50">
                <th className="py-3.5 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  User
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  Role
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  Status
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  Created Date
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="animate-spin" size={18} />
                      <span>Loading user accounts...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-red-500">
                    Error loading users: {(error as Error)?.message}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No user accounts found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const initials = `${user.first_name?.[0] || ""}${
                    user.last_name?.[0] || ""
                  }`.toUpperCase() || "U";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white leading-tight">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getRoleBadge(user.user_type)}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(user)}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReset(user)}
                            className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition"
                            title="Reset Password"
                          >
                            <Key size={17} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                            title="Edit User"
                          >
                            <Edit size={17} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(user)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                            title="Delete User"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          CREATE USER MODAL
      ========================================================================= */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        className="w-full max-w-lg p-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <UserPlus size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New User
            </h3>
          </div>
        </div>

        <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={createForm.first_name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, first_name: e.target.value })
                }
                placeholder="e.g. John"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={createForm.last_name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, last_name: e.target.value })
                }
                placeholder="e.g. Doe"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={createForm.email}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              placeholder="e.g. john.doe@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCreatePassword ? "text" : "password"}
                required
                minLength={6}
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowCreatePassword(!showCreatePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCreatePassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Must be at least 6 characters long.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role / User Type <span className="text-red-500">*</span>
            </label>
            <select
              value={createForm.user_type}
              onChange={(e) =>
                setCreateForm({ ...createForm, user_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={createForm.is_active ?? true}
                onChange={(e) =>
                  setCreateForm({ ...createForm, is_active: e.target.checked })
                }
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Activate account immediately
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 transition flex items-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create User</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          EDIT USER MODAL
      ========================================================================= */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        className="w-full max-w-lg p-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Edit size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit User Details
            </h3>
          </div>
        </div>

        <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editForm.first_name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, first_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editForm.last_name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, last_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={editForm.email || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role / User Type <span className="text-red-500">*</span>
            </label>
            <select
              value={editForm.user_type || "teacher"}
              onChange={(e) =>
                setEditForm({ ...editForm, user_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.is_active ?? true}
                onChange={(e) =>
                  setEditForm({ ...editForm, is_active: e.target.checked })
                }
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Active Account
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.is_blacklisted ?? false}
                onChange={(e) =>
                  setEditForm({ ...editForm, is_blacklisted: e.target.checked })
                }
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-700"
              />
              <span className="text-sm text-red-600 dark:text-red-400">
                Blacklisted / Suspended
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          RESET PASSWORD MODAL (Admin Action)
      ========================================================================= */}
      <Modal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        className="w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Lock size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reset Password
            </h3>
          </div>
        </div>

        {selectedUser && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
              Admin Password Override
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
              Assigning a new password for: <strong>{selectedUser.first_name} {selectedUser.last_name}</strong> ({selectedUser.email})
            </p>
          </div>
        )}

        <form onSubmit={handleResetSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showResetPassword ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowResetPassword(!showResetPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showResetPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showResetPassword ? "text" : "password"}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsResetOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          DELETE USER CONFIRMATION MODAL
      ========================================================================= */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="w-full max-w-md p-6"
      >
        <div className="flex items-center gap-3 text-red-600">
          <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete User Account
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {selectedUser && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to permanently delete{" "}
            <strong>
              {selectedUser.first_name} {selectedUser.last_name}
            </strong>{" "}
            ({selectedUser.email})?
          </p>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            {deleteMutation.isPending ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Account</span>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}
