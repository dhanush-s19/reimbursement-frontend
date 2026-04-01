"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Certification } from "@/types/certification";
import AddCertificationForm from "./AddCertificationFrom";
import Table from "../ui/Table";
import Button from "../ui/Button";
import Toast, { ToastType } from "../ui/Toast";
import { Pagination } from "../Pagination";

export default function CertificationTable() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const fetchCertifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
      });

      const data = await apiFetch(`/api/certifications/page?${params}`);
      setCertifications(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      console.error("Failed to fetch certifications", err);
      showToast("Failed to load certifications", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const toggleStatus = async (cert: Certification) => {
    if (!cert.id) return;
    const newStatus = cert.status === "Active" ? "On Hold" : "Active";
    try {
      setUpdatingId(cert.id);
      await apiFetch(`/api/certifications/update/${cert.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...cert, status: newStatus }),
      });
      fetchCertifications();
      showToast(`Status updated to ${newStatus}`, "success");
    } catch (err) {
      console.error("Failed to update status", err);
      showToast("Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteCertification = async (cert: Certification) => {
    if (!cert.id) return;
    if (!confirm(`Are you sure you want to delete "${cert.certification}"?`))
      return;

    try {
      setDeletingId(cert.id);
      await apiFetch(`/api/certifications/delete/${cert.id}`, {
        method: "DELETE",
      });
      fetchCertifications();
      showToast("Certification deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete certification", err);
      showToast("Failed to delete certification", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdded = () => {
    setShowAddModal(false);
    setCurrentPage(0); // Reset to first page to see new entry
    fetchCertifications();
    showToast("Certification added successfully", "success");
  };

  const columns = [
    {
      header: "Sl No",
      render: (_: Certification, index: number) => (
        <span className="font-medium text-gray-600">
          {(index + 1 + currentPage * pageSize).toString().padStart(2, "0")}
        </span>
      ),
    },
    {
      header: "Category",
      render: (cert: Certification) => (
        <span className="whitespace-nowrap">{cert.category}</span>
      ),
    },
    {
      header: "Certification",
      render: (cert: Certification) => (
        <span className="font-semibold text-gray-800">
          {cert.certification}
        </span>
      ),
    },
    {
      header: "Roles",
      render: (cert: Certification) => (
        <div className="max-w-[200px] text-sm text-gray-600">
          {cert.recommendedRoles?.length > 0 
            ? cert.recommendedRoles.join(", ") 
            : "No roles assigned"}
        </div>
      ),
    },
    {
      header: "Status",
      render: (cert: Certification) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            cert.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {cert.status}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (cert: Certification) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            disabled={updatingId === cert.id}
            onClick={() => toggleStatus(cert)}
            className="hover:bg-gray-50 px-3 py-1 text-xs"
          >
            {updatingId === cert.id ? "..." : "Status"}
          </Button>

          <Button
            variant="outline"
            disabled={deletingId === cert.id}
            onClick={() => deleteCertification(cert)}
            className="text-red-600 border-red-200 hover:bg-red-50 px-3 py-1 text-xs"
          >
            {deletingId === cert.id ? "..." : "Delete"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
            <p className="text-sm text-gray-500">
              Manage and track professional certifications
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto text-white shadow-sm"
          >
            + Add New
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table
            data={certifications}
            columns={columns}
            loading={loading}
            emptyMessage="No certifications found"
          />
        </div>

        {/* Add Certification Form (Modal handled internally by ModalForm) */}
        <AddCertificationForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdded={handleAdded}
        />
      </main>

      {/* Pagination Footer */}
      <footer className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 z-50">
        <div className="flex justify-center items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        </div>
      </footer>
    </div>
  );
}