"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Table from "../ui/Table";
import { Reimbursement } from "@/types/reimbursement";
import { Pagination } from "../Pagination";
import { ClipboardCheck, Clock, ListFilter, ChevronUp, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

interface ManagerQueueProps {
    managerId: string;
}

const SortIcon = ({ field, sortBy, direction }: { field: string; sortBy: string; direction: string }) => {
    if (sortBy !== field) return null;
    return direction === "asc" ? (
        <ChevronUp size={14} className="ml-1" />
    ) : (
        <ChevronDown size={14} className="ml-1" />
    );
};

export default function ManagerQueuePage({ managerId }: Readonly<ManagerQueueProps>) {
    const router = useRouter();
    const [data, setData] = useState<Reimbursement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [direction, setDirection] = useState<"asc" | "desc">("desc");

    const pageSize = 10;

    const fetchQueue = useCallback(async () => {
        if (!managerId) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                size: pageSize.toString(),
                sortBy: sortBy,
                direction: direction,
            });
            const url = `/api/reimbursements/queue/manager/${managerId}?${queryParams}`;
            const res = await apiFetch(url);
            const extractedData = res?.content?.map((item: any) => ({
                ...item.reimbursement, 
                allowedNextStatuses: item.allowedNextStatuses,
                showReasonField: item.showReasonField
            })) || [];

            setData(extractedData);
            setTotalPages(res?.totalPages || 0);
        } catch (error) {
            console.error("Failed to fetch manager queue:", error);
        } finally {
            setLoading(false);
        }
    }, [managerId, currentPage, sortBy, direction]);

    useEffect(() => {
        fetchQueue();
    }, [fetchQueue]);

    const handleSort = (field: string) => {
        setCurrentPage(0);
        if (sortBy === field) {
            setDirection(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setDirection("desc");
        }
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
            header: "Employee",
            render: (row: Reimbursement) => (
                <div className="flex flex-col py-1">
                    <span className="font-bold text-gray-900 leading-tight">{row?.name || "Unknown"}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">ID: {row?.employeeId || "N/A"}</span>
                </div>
            ),
        },
        {
            header: "Claim Details",
            render: (row: Reimbursement) => (
                <div className="flex flex-col py-1 min-w-[160px]">
                    <span className="font-semibold text-gray-900 leading-tight">{row?.title || "No Title"}</span>
                    <span className="text-[10px] uppercase tracking-wider text-blue-500 font-bold">{row?.type || "General"}</span>
                </div>
            ),
        },
        {
            header: "Amount",
            render: (row: Reimbursement) => (
                <span className="font-mono font-bold text-gray-900 whitespace-nowrap">
                    {/* Fixed: Added nullish coalescing to prevent undefined toLocaleString error */}
                    ₹{(row?.amount ?? 0).toLocaleString("en-IN")}
                </span>
            ),
        },
        {
            header: "Submitted",
            render: (row: Reimbursement) => (
                <div className="flex items-center text-gray-500 text-[13px] tabular-nums">
                    <Clock size={12} className="mr-1.5 opacity-60" />
                    {row?.createdAt
                        ? new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                        : "N/A"}
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
                            <div className="flex items-center gap-3 mb-1">
                                <ClipboardCheck className="text-blue-600" size={32} />
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Approval Queue</h2>
                            </div>
                            <p className="text-gray-500 text-sm italic">Reviewing pending claims for Manager ID: {managerId}</p>
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
                            Submission Date <SortIcon field="createdAt" sortBy={sortBy} direction={direction} />
                        </Button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
                        <Table
                            data={data}
                            columns={columns}
                            loading={loading}
                            emptyMessage="Great job! No pending approvals for your team."
                            onRowClick={(row) => router.push(`/reimbursement-request/${row.id}`)}
                        />
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-10">
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