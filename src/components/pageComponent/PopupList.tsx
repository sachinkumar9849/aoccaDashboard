"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash, Plus, Eye, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "@/api/client";
import { PopupItem } from "@/types";
import Link from "next/link";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import TableListLoading from "../loading/TableListLoading";
import { toast } from "react-hot-toast";

const PopupList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title?: string } | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<PopupItem[]>({
    queryKey: ["popups-list"],
    queryFn: () => apiClient.getPopups(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deletePopup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popups-list"] });
      toast.success("Popup image deleted successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete popup");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiClient.updatePopupJson(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popups-list"] });
      toast.success("Popup status updated!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleToggleStatus = (item: PopupItem) => {
    const newStatus = item.status === "active" ? "inactive" : "active";
    toggleStatusMutation.mutate({ id: item.id, status: newStatus });
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <TableListLoading />;
  }

  if (isError) {
    return (
      <div className="p-4 border rounded bg-red-100 border-red-400 text-red-700">
        <p className="font-medium">Error loading popup images</p>
        <p>{(error as Error)?.message || "An unexpected error occurred"}</p>
      </div>
    );
  }

  const items = Array.isArray(data) ? data : [];
  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Header Popup Images</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage promotional popup banners shown to visitors in the website header.
          </p>
        </div>
        <Link
          href="/popup-add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Popup
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All ({items.length})
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "active"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Active ({items.filter((i) => i.status === "active").length})
        </button>
        <button
          onClick={() => setActiveTab("inactive")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "inactive"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Inactive ({items.filter((i) => i.status === "inactive").length})
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <Eye size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No popup images found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              {activeTab === "all"
                ? "No popup banners have been added yet. Click Add New Popup to create your first promotional popup."
                : `No popups currently marked as "${activeTab}".`}
            </p>
            {activeTab === "all" && (
              <Link
                href="/popup-add"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Plus size={16} />
                Create First Popup
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 font-semibold">#</th>
                  <th className="py-3.5 px-4 font-semibold">Preview</th>
                  <th className="py-3.5 px-4 font-semibold">Title</th>
                  <th className="py-3.5 px-4 font-semibold">Target Link</th>
                  <th className="py-3.5 px-4 font-semibold">Order</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Created</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredItems.map((item, index) => {
                  const isActive = item.status === "active";
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div
                          onClick={() => setPreviewImage({ url: item.image_url, title: item.title })}
                          className="relative w-20 h-14 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group bg-gray-100 shadow-2xs"
                        >
                          <img
                            src={item.image_url}
                            alt={item.title || "Popup preview"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Eye size={16} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {item.title ? (
                          <span>{item.title}</span>
                        ) : (
                          <span className="text-gray-400 italic">Untitled Popup</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                        {item.link_url ? (
                          <a
                            href={item.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline max-w-[200px] truncate"
                            title={item.link_url}
                          >
                            {item.link_url}
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                          {item.display_order ?? 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {isActive ? <CheckCircle size={13} /> : <XCircle size={13} />}
                          {isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-gray-500 text-xs">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/popup-list/${item.id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Popup"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Popup"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h4 className="font-semibold text-gray-800">
                {previewImage.title || "Popup Image Preview"}
              </h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-gray-50 max-h-[70vh] overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.title || "Popup Full Preview"}
                className="max-h-[60vh] w-auto max-w-full rounded-lg object-contain shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Popup Image?"
        description="Are you sure you want to delete this popup image? This will permanently delete the image and remove it from the website."
      />
    </div>
  );
};

export default PopupList;
