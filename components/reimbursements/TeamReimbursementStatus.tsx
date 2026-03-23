"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";
import Table from "../ui/Table";
import { Reimbursement } from "@/types/reimbursement";
import { Pagination } from "../Pagination";

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export default function TeamReimbursementStatus() {
    const [data, setData] = useState<Reimbursement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchTeamReimbursements = useCallback(async () => {
        setLoading(true);

        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                size: "10",
            });

            const endpoint = `/api/reimbursements/type/TEAM_EVENTS?${queryParams.toString()}`;

            const res: PageResponse<Reimbursement> = await apiFetch(endpoint);

            console.log("Team Events API Response:", res);
            setData(res.content || []);
            setTotalPages(res.totalPages || 0);
        } catch (error) {
            console.error("Failed to fetch team reimbursements:", error);
            setData([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchTeamReimbursements();
    }, [fetchTeamReimbursements]);

    const columns = [
        {
            header: "Title",
            render: (row: Reimbursement) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row.title}</span>
                    <span className="text-xs text-gray-500">{row.type}</span>
                </div>
            ),
        },
        {
            header: "Requested",
            render: (row: Reimbursement) =>
                row.amount != null ? `₹${row.amount.toLocaleString("en-IN")}` : "₹0",
        },
        {
            header: "Approved",
            render: (row: Reimbursement) =>
                row.approvedAmount != null
                    ? `₹${row.approvedAmount.toLocaleString("en-IN")}`
                    : "—",
        },
        {
            header: "Status",
            render: (row: Reimbursement) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusStyles(
                        row.status
                    )}`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            header: "Approved Amount",
            render: (row: Reimbursement) => row.approvedAmount
        },
        {
            header: "Date",
            render: (row: Reimbursement) =>
                new Date(row.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
        },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Team Reimbursement Status
            </h1>

            <div className="mt-4 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table data={data} columns={columns} loading={loading} />

                    {!loading && data.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No team reimbursements found.</p>
                            <p className="text-sm">
                                Once submitted, reimbursements will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
}

function getStatusStyles(status: string) {
    switch (status?.toUpperCase()) {
        case "APPROVED":
            return "bg-green-100 text-green-700 border border-green-200";
        case "PENDING":
        case "UNDER_REVIEW":
        case "FORWARDED_TO_HR":
            return "bg-yellow-100 text-yellow-700 border border-yellow-200";
        case "REJECTED":
        case "HR_REJECTED":
        case "ACCOUNTANT_REJECTED":
            return "bg-red-100 text-red-700 border border-red-200";
        default:
            return "bg-gray-100 text-gray-700 border border-gray-200";
    }
}