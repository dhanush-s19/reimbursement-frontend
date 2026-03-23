"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Certification } from "@/types/certification";
import AddCertificationForm from "./AddCertificationFrom";
import Table from "../ui/Table";
import Button from "../ui/Button";

export default function CertificationTable() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/certifications/all");
      setCertifications(data);
    } catch (err) {
      console.error("Failed to fetch certifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const toggleStatus = async (cert: Certification) => {
    if (!cert.id) return;
    const newStatus = cert.status === "Active" ? "On Hold" : "Active";
    try {
      setUpdatingId(cert.id);
      await apiFetch(`/api/certifications/update/${cert.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...cert, status: newStatus }),
      });
      setCertifications((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteCertification = async (cert: Certification) => {
    if (!cert.id) return;
    if (!confirm(`Are you sure you want to delete "${cert.certification}"?`)) return;

    try {
      setDeletingId(cert.id);
      await apiFetch(`/api/certifications/delete/${cert.id}`, { method: "DELETE" });
      setCertifications((prev) => prev.filter((c) => c.id !== cert.id));
    } catch (err) {
      console.error("Failed to delete certification", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdded = () => {
    setShowAddModal(false);
    fetchCertifications();
  };

  const columns = [
    {
      header: "Sl No",
      render: (_: Certification, index: number) => (
        <span className="font-medium text-gray-600">{index + 1}</span>
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
        <span className="font-semibold text-gray-800">{cert.certification}</span>
      ),
    },
    {
      header: "Roles",
      render: (cert: Certification) => (
        <div className="max-w-[200px] text-sm text-gray-600">
          {cert.recommendedRoles.join(", ")}
        </div>
      ),
    },
    {
      header: "Status",
      render: (cert: Certification) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cert.status === "Active"
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
            className="hover:bg-gray px-3 py-1 text-xs"
          >
            {updatingId === cert.id ? "..." : "Status"}
          </Button>

          <Button
            variant="outline"
            disabled={deletingId === cert.id}
            onClick={() => deleteCertification(cert)}
            className="bg-red text-red-700 hover:bg-red-100 px-3 py-1 text-xs"
          >
            {deletingId === cert.id ? "..." : "Delete"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
          <p className="text-sm text-gray-500">Manage and track your professional certifications</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto   text-white shadow-sm transition-all"
        >
          + Add New
        </Button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden">
          <Table
            data={certifications}
            columns={columns}
            loading={loading}
            emptyMessage="No certifications found"
          />
        </div>
        
      </div>

      {/* Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          {/* Modal Container */}
          <div
            className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in duration-200"
          >
            {/* Close Button */}
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <span className="text-2xl leading-none">&times;</span>
            </Button>

            <div className="mt-2">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Add Certification</h2>
              <AddCertificationForm onAdded={handleAdded} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}