"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Certification } from "@/types/certification";
import Table from "../ui/Table";
import { Award } from "lucide-react";
import { Pagination } from "../Pagination";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function ActiveCertificationTable() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const router = useRouter();
  const fetchCertifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: "Active",
        page: currentPage.toString(),
        size: pageSize.toString(),
      });

      const data = await apiFetch(`/api/certifications/status/page?${params}`);
      setCertifications(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      console.error("Failed to fetch certifications", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const handleRowClick = (cert: Certification) => {
    router.push(
      `/certification/enroll?certId=${cert.id}&name=${encodeURIComponent(cert.certification)}`,
    );
  };

  const columns = [
    {
      header: "Sl No",
      render: (_: Certification, index: number) => (
        <span className="font-mono text-xs font-bold text-gray-400">
          {(index + 1 + currentPage * pageSize).toString().padStart(2, "0")}
        </span>
      ),
    },
    {
      header: "Category",
      render: (cert: Certification) => (
        <span className="whitespace-nowrap px-2.5 py-1 rounded-md bg-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-600 border border-gray-200">
          {cert.category}
        </span>
      ),
    },
    {
      header: "Certification",
      render: (cert: Certification) => (
        <div className="min-w-[200px] font-semibold text-gray-900 leading-tight">
          {cert.certification}
        </div>
      ),
    },
    {
      header: "Recommended Roles",
      render: (cert: Certification) => (
        <div className="flex flex-wrap gap-1.5 max-w-xs py-1">
          {cert.recommendedRoles.map((role) => (
            <span
              key={`${cert.id}-${role}`}
              className="text-sm text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100"
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Status",
      render: (cert: Certification) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
          {cert.status}
        </span>
      ),
    },
    {
      header: "Action",
      render: (cert: Certification) => (
        <Button
          onClick={() => handleRowClick(cert)}
          variant="outline"
          size="sm"
        >
          Request Enrollment
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="text-gray-400" size={24} />
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Certifications
                </h2>
              </div>
              <p className="text-gray-500">
                Manage and browse verified professional benchmarks
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Total Active: {certifications.length}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
            <Table
              data={certifications}
              columns={columns}
              loading={loading}
              emptyMessage="No active certifications available at this time."
            />
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
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
