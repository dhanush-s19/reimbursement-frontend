"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; 
import Table from "../ui/Table";
import { Reimbursement } from "@/types/reimbursement";
import { Pagination } from "../Pagination";
import { ReceiptText, Clock, ChevronUp, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

interface ReimbursementPageProps {
    id: string;
}

const SortIcon = ({ field, sortBy, direction }: { field: string; sortBy: string; direction: string }) => {
    if (sortBy !== field) return null;
    return direction === "asc" ? (
        <ChevronUp size={14} className="ml-1" />
    ) : (
        <ChevronDown size={14} className="ml-1" />
    );
};

export default function ReimbursementPage({ id }: Readonly<ReimbursementPageProps>) {
    const router = useRouter(); 
    const [data, setData] = useState<Reimbursement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [direction, setDirection] = useState<"asc" | "desc">("desc");
    const pageSize = 10;

    const fetchReimbursements = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                size: pageSize.toString(),
                sortBy: sortBy,
                direction: direction,
            });

            const url = `/api/reimbursements/employee/${id}?${queryParams.toString()}`;
            const res: PageResponse<Reimbursement> = await apiFetch(url);

            setData(res?.content || []);
            setTotalPages(res?.totalPages || 0);
        } catch (error) {
            console.error("Failed to fetch reimbursements:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [id, currentPage, sortBy, direction]); // Dependencies ensure re-fetch on change

    useEffect(() => {
        fetchReimbursements();
    }, [fetchReimbursements]);

    const handleSort = (field: string) => {
        // Reset to first page when sorting changes
        setCurrentPage(0);
        if (sortBy === field) {
            setDirection(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setDirection("desc");
        }
    };

    const handleRowClick = (row: Reimbursement) => {
        router.push(`/reimbursement/${row.id}`);
    };

    const columns = [
        {
            header: "Sl No",
            render: (_: Reimbursement, index: number) => (
                <span className="font-mono text-xs font-bold text-gray-400">
                    {(index + 1 + currentPage * pageSize).toString().padStart(2, "0")}
                </span>
            ),
        },
        {
            header: "Reimbursement Details",
            render: (row: Reimbursement) => (
                <div className="flex flex-col py-1 min-w-[180px]">
                    <span className="font-semibold text-gray-900 leading-tight">{row.title}</span>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{row.type}</span>
                </div>
            ),
        },
        {
            header: "Requested Amount",
            render: (row: Reimbursement) => (
                <span className="font-mono font-bold text-gray-900">
                    ₹{row.amount.toLocaleString("en-IN")}
                </span>
            ),
        },
        {
            header: "Approved Amount",
            render: (row: Reimbursement) => (
                <span className={`font-mono font-bold ${row.approvedAmount ? "text-emerald-600" : "text-gray-300 italic text-xs"}`}>
                    {row.approvedAmount === null || row.approvedAmount === undefined
                        ? "Pending"
                        : `₹${row.approvedAmount.toLocaleString("en-IN")}`}
                </span>
            ),
        },
        {
            header: "Status",
            render: (row: Reimbursement) => (
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${getStatusStyles(row.status)}`}>
                    {row.status?.replaceAll("_", " ")}
                </span>
            ),
        },
        {
            header: "Submission Date",
            render: (row: Reimbursement) => (
                <div className="flex items-center text-gray-500 text-sm tabular-nums whitespace-nowrap">
                    <Clock size={14} className="mr-1.5 opacity-70" />
                    {new Date(row.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </div>
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
                                <ReceiptText className="text-gray-400" size={28} />
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Reimbursements</h2>
                            </div>
                            <p className="text-gray-500">
                                Viewing claims for Employee ID: <span className="font-mono font-semibold text-gray-700">{id}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
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
                            Date <SortIcon field="createdAt" sortBy={sortBy} direction={direction} />
                        </Button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <Table
                            data={data}
                            columns={columns}
                            loading={loading}
                            emptyMessage="No reimbursement records found."
                            onRowClick={handleRowClick}
                        />
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 z-10">
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

function getStatusStyles(status: string) {
    const s = status?.toUpperCase();
    switch (s) {
        case "PAID":
        case "ACCOUNTANT_FINAL_APPROVED":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "SUBMITTED":
            return "bg-amber-50 text-amber-700 border-amber-200";
        case "FORWARDED_TO_HR":
        case "HR_APPROVED":
            return "bg-blue-50 text-blue-700 border-blue-200";
        case "REJECTED":
        case "HR_REJECTED":
        case "ACCOUNTANT_REJECTED":
            return "bg-rose-50 text-rose-700 border-rose-200";
        case "BACK_TO_ACCOUNTANT":
            return "bg-purple-50 text-purple-700 border-purple-200";
        default:
            return "bg-gray-50 text-gray-600 border-gray-200";
    }
}