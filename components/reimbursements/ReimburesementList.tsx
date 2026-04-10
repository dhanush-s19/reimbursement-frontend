"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Reimbursement } from "@/types/reimbursement";
import Table from "../ui/Table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Button from "../ui/Button";
import { ChevronUp, ChevronDown, ListFilter, ReceiptText, RotateCcw } from "lucide-react";
import { Pagination } from "../Pagination";

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
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  const fetchReimbursements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(
        `/api/reimbursements/type/${TYPE_MAP[view]}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
      );
      setReimbursements(res?.content ?? []);
      setTotalPages(res?.totalPages ?? 0);
      setTotalElements(res?.totalElements ?? 0);
    } catch (err) {
      setError("Failed to load reimbursements. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [view, page, size, sortBy, direction]);

  useEffect(() => {
    fetchReimbursements();
  }, [fetchReimbursements]);

  const handleRowClick = (r: Reimbursement) => {
    if (role === "HR" ||"ACCOUNTANT") {
      router.push(`/reimbursement-request/${r.id}`);
    }
  };

  const handleSort = (field: string) => {
    setPage(0); 
    if (sortBy === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setDirection("desc");
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
        <div className="flex flex-col items-start gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${statusStyles[r.status] || "bg-gray-50 text-gray-600 border-gray-200"
              }`}
          >
            {r.status.replaceAll("_", " ")}
          </span>

          {r.resubmitted && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded text-[9px] font-extrabold uppercase tracking-tighter">
              <RotateCcw size={10} /> Resubmitted
            </span>
          )}
        </div>
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

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ReceiptText className="text-black-600" size={28} />
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reimbursements</h2>
              </div>
              <p className="text-gray-500 text-sm">Review and manage employee expense claims</p>
            </div>
          </header>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center text-gray-400 mr-2">
              <ListFilter size={18} />
              <span className="text-xs font-bold uppercase ml-2 tracking-widest">Sort By:</span>
            </div>
            <Button
              size="sm"
              variant={sortBy === "amount" ? "secondary" : "outline"}
              className="rounded-full px-4 text-xs font-semibold"
              onClick={() => handleSort("amount")}
            >
              Amount <SortIcon field="amount" sortBy={sortBy} direction={direction} />
            </Button>
            <Button
              size="sm"
              variant={sortBy === "createdAt" ? "secondary" : "outline"}
              className="rounded-full px-4 text-xs font-semibold"
              onClick={() => handleSort("createdAt")}
            >
              Date <SortIcon field="createdAt" sortBy={sortBy} direction={direction} />
            </Button>

            <div className="ml-auto flex items-center gap-1.5 p-1 bg-gray-200/50 rounded-2xl border border-gray-200">
              {(["normal", "certificate", "team"] as const).map((v) => (
                <Button
                  key={v}
                  size="sm"
                  variant={view === v ? "secondary" : "ghost"}
                  className={`rounded-xl px-4 capitalize text-xs font-semibold ${view === v ? "shadow-sm hover:bg-gray" : "text-gray-500"
                    }`}
                  onClick={() => {
                    setView(v);
                    setPage(0);
                  }}
                >
                  {v}
                </Button>
              ))}
            </div>
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
              emptyMessage={`No ${view} claims found.`}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-10">
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