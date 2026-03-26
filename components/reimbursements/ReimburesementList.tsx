"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Reimbursement } from "@/types/reimbursement";
import Table from "../ui/Table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Button from "../ui/Button";
import { Pagination } from "../Pagination";
import { ChevronUp, ChevronDown, ListFilter } from "lucide-react";

type Props = Readonly<{
  role: string;
}>;

const SortIcon = ({ field, sortBy, direction }: { field: string; sortBy: string; direction: string }) => {
  if (sortBy !== field) return null;
  return direction === "asc" ? (
    <ChevronUp size={14} className="ml-1" />
  ) : (
    <ChevronDown size={14} className="ml-1" />
  );
};

const TYPE_MAP = {
  normal: "NORMAL",
  certificate: "CERTIFICATE",
  team: "TEAM_EVENTS",
};

export default function ReimbursementList({ role }: Props) {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<keyof typeof TYPE_MAP>("normal");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  const fetchReimbursements = useCallback(async () => {
  setLoading(true);
  setError(null);
  const res = await apiFetch(
    `/api/reimbursements/type/${TYPE_MAP[view]}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
  );

  setReimbursements(res?.content ?? []);
  setTotalPages(res?.totalPages ?? 0);
  setLoading(false);
}, [view, page, size, sortBy, direction]);

  useEffect(() => {
    fetchReimbursements();
  }, [fetchReimbursements]);

  const handleRowClick = (r: Reimbursement) => {
    if (role === "ACCOUNTANT") {
      router.push(`/reimbursement-request/${r.id}`);
    }
  };

  const statusStyles: Record<string, string> = {
    SUBMITTED: "bg-amber-50 text-amber-700 border-amber-200",
    FORWARDED_TO_HR: "bg-blue-50 text-blue-700 border-blue-200",
    HR_APPROVED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    HR_REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    BACK_TO_ACCOUNTANT: "bg-purple-50 text-purple-700 border-purple-200",
    ACCOUNTANT_FINAL_APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ACCOUNTANT_REJECTED: "bg-red-50 text-red-700 border-red-200",
    PAID: "bg-green-100 text-green-800 border-green-300",
  };

  const columns = [
    {
      header: "Employee",
      render: (r: Reimbursement) => (
        <div className="flex flex-col py-1">
          <span className="font-semibold text-gray-900 leading-tight">{r.name}</span>
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{r.employeeId}</span>
        </div>
      ),
    },
    {
      header: "Title",
      render: (r: Reimbursement) => <span className="font-mono font-bold text-gray-900">{r.title}</span>,
    },
    {
      header: "Requested Amount",
      render: (r: Reimbursement) => (
        <span className="font-mono font-bold text-gray-900">
          ₹{r.amount?.toLocaleString("en-IN") ?? "0"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (r: Reimbursement) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${
            statusStyles[r.status] || "bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          {r.status.replaceAll("_", " ")}
        </span>
      ),
    },
    {
      header: "Approved Amount",
      render: (r: Reimbursement) =>
        r.status === "ACCOUNTANT_FINAL_APPROVED" || r.status === "PAID" ? (
          <span className="font-mono font-bold text-emerald-600">
            ₹{(r.approvedAmount ?? 0).toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-gray-300 italic text-xs">Pending</span>
        ),
    },
    {
      header: "Date",
      render: (r: Reimbursement) => (
        <div className="text-sm text-gray-500 tabular-nums">
          {r.createdAt ? format(new Date(r.createdAt), "dd MMM, yyyy") : "—"}
        </div>
      ),
    },
  ];

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setDirection("desc");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reimbursements</h2>
              <p className="text-gray-500 mt-1">Review and manage employee expense claims</p>
            </div>

            <div className="inline-flex p-1 bg-gray-200/60 backdrop-blur-sm rounded-xl border border-gray-200">
              {(["normal", "certificate", "team"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setView(v);
                    setPage(0);
                  }}
                  className={`px-5 py-2 text-sm font-semibold transition-all duration-200 rounded-lg capitalize ${
                    view === v ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center text-gray-400 mr-2">
              <ListFilter size={18} />
              <span className="text-xs font-bold uppercase ml-2 tracking-widest">Sort By:</span>
            </div>

            <Button
              size="sm"
              variant={sortBy === "amount" ? "secondary" : "outline"}
              className="rounded-full px-4"
              onClick={() => handleSort("amount")}
            >
              Amount <SortIcon field="amount" sortBy={sortBy} direction={direction} />
            </Button>

            <Button
              size="sm"
              variant={sortBy === "createdAt" ? "secondary" : "outline"}
              className="rounded-full px-4"
              onClick={() => handleSort("createdAt")}
            >
              Submission Date <SortIcon field="createdAt" sortBy={sortBy} direction={direction} />
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
            <Table
              data={reimbursements}
              columns={columns}
              loading={loading}
              emptyMessage={`No ${view} claims found for this period.`}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <div className="flex justify-center items-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </div>
      </footer>
    </div>
  );
}