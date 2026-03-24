"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Reimbursement } from "@/types/reimbursement";
import { useRouter } from "next/navigation";
import Table from "../ui/Table";
import { Pagination } from "../Pagination";
import Button from "../ui/Button";
import { ChevronUp, ChevronDown, ListFilter } from "lucide-react";

type Props = {
  hrId: string;
};

type ReimbursementResponse = {
  reimbursement: Reimbursement;
  allowedNextStatuses: string[];
  showApprovedAmountField: boolean;
  showReasonField: boolean;
};

type Page<T> = {
  content: T[];
  totalPages: number;
  number: number;
};

const SortIcon = ({ field, sortBy, direction }: { field: string; sortBy: string; direction: string }) => {
  if (sortBy !== field) return null;
  return direction === "asc" ? (
    <ChevronUp size={14} className="ml-1" />
  ) : (
    <ChevronDown size={14} className="ml-1" />
  );
};

export default function HRReimbursementList({ hrId }:Readonly <Props>) {
  const [data, setData] = useState<ReimbursementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res: Page<ReimbursementResponse> = await apiFetch(
        `/api/reimbursements/queue/hr?page=${page}&size=10&sortBy=${sortBy}&direction=${direction}`
      );
      setData(res?.content || []);
      setTotalPages(res?.totalPages || 0);
    } catch (err) {
      console.error("Failed to fetch HR queue", err);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, direction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setDirection("desc");
    }
    setPage(0); 
  };

  const handleRowClick = (r: ReimbursementResponse) => {
    router.push(`/hr/hr-reimbursement-request/${r.reimbursement.id}`);
  };

  const columns = [
    {
      header: "Title",
      render: (r: ReimbursementResponse) => (
        <span className="font-semibold text-gray-900">{r.reimbursement.title}</span>
      ),
    },
    {
      header: "Type",
      render: (r: ReimbursementResponse) => (
        <span className="text-sm text-gray-600">
          {r.reimbursement.type}
          {r.reimbursement.requiresHrApproval && (
            <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">
              HR Required
            </span>
          )}
        </span>
      ),
    },
    {
      header: "Amount",
      render: (r: ReimbursementResponse) => (
        <span className="font-mono font-bold text-gray-900">
          ₹{r.reimbursement.amount?.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Employee",
      render: (r: ReimbursementResponse) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{r.reimbursement.name}</span>
          <span className="text-xs text-gray-400">{r.reimbursement.employeeId}</span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (r: ReimbursementResponse) => {
        const status = (r.reimbursement.status ?? "UNKNOWN").replaceAll("_", " ");
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-bold uppercase tracking-wide">
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            HR Approval Queue
          </h2>
          <p className="text-gray-500 mt-1">Pending actions required for employee reimbursements</p>
        </header>

        {/* Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center text-gray-400 mr-2">
            <ListFilter size={18} />
            <span className="text-xs font-bold uppercase ml-2 tracking-widest">Sort By:</span>
          </div>

          <Button
            size="sm"
            variant={sortBy === "createdAt" ? "secondary" : "outline"}
            className="rounded-full px-4"
            onClick={() => handleSort("createdAt")}
          >
            Date <SortIcon field="createdAt" sortBy={sortBy} direction={direction} />
          </Button>

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
            variant={sortBy === "status" ? "secondary" : "outline"}
            className="rounded-full px-4"
            onClick={() => handleSort("status")}
          >
            Status <SortIcon field="status" sortBy={sortBy} direction={direction} />
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
          <Table
            data={data}
            columns={columns}
            loading={loading}
            emptyMessage="No reimbursements pending HR approval"
            onRowClick={handleRowClick}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}