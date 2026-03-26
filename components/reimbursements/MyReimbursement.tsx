"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; 
import Table from "../ui/Table";
import { Reimbursement } from "@/types/reimbursement";
import { Pagination } from "../Pagination";
import { ReceiptText, Clock, ChevronUp, ChevronDown, ListFilter } from "lucide-react";
import Button from "../ui/Button";
import CompletionModal from "../certifications/CompletionModal";
import ActionCell from "../certifications/ActionCell";


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
    const [selectedCert, setSelectedCert] = useState<Reimbursement | null>(null);

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
        } finally {
            setLoading(false);
        }
    }, [id, currentPage, sortBy, direction]); 

    useEffect(() => {
        fetchReimbursements();
    }, [fetchReimbursements]);

    const handleSort = (field: string) => {
        setCurrentPage(0);
        if (sortBy === field) {
            setDirection(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setDirection("desc");
        }
    };

    const handleCertificationComplete = async (formData: FormData) => {
        try {
            await apiFetch(`/api/reimbursements/${selectedCert?.id}/complete-certification`, {
                method: "PUT",
                body: formData 
            });
            alert("Success! Your documents and final amount have been submitted.");
            fetchReimbursements(); 
        } catch (err) {
            throw err; 
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
            header: "Details",
            render: (row: Reimbursement) => (
                <div className="flex flex-col py-1 min-w-[160px]">
                    <span className="font-semibold text-gray-900 leading-tight">{row.title}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{row.type}</span>
                </div>
            ),
        },
        {
            header: "Amount",
            render: (row: Reimbursement) => (
                <span className="font-mono font-bold text-gray-900 whitespace-nowrap">
                    ₹{row.amount.toLocaleString("en-IN")}
                </span>
            ),
        },
        {
            header: "Status",
            render: (row: Reimbursement) => (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusStyles(row.status)}`}>
                    {row.status?.replaceAll("_", " ")}
                </span>
            ),
        },
        {
            header: "Submission",
            render: (row: Reimbursement) => (
                <div className="flex items-center text-gray-500 text-[13px] tabular-nums">
                    <Clock size={12} className="mr-1.5 opacity-60" />
                    {new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </div>
            ),
        },
        {
            header: "Action",
            render: (row: Reimbursement) => (
                <ActionCell row={row} onSelect={setSelectedCert} />
            ),
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 pb-32">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <ReceiptText className="text-black-600" size={28} />
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Reimbursements</h2>
                            </div>
                            <p className="text-gray-500 text-sm italic">Tracking claims for {id}</p>
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
                            emptyMessage="No reimbursement records found."
                            onRowClick={(row) => router.push(`/reimbursement/${row.id}`)}
                        />
                    </div>
                </div>
            </main>

            {selectedCert && (
                <CompletionModal
                    reimbursement={selectedCert}
                    isOpen={!!selectedCert}
                    onClose={() => setSelectedCert(null)}
                    onConfirm={handleCertificationComplete}
                />
            )}

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
        default:
            return "bg-gray-50 text-gray-600 border-gray-200";
    }
}