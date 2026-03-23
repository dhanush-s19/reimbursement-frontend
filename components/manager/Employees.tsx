'use client'

import { useEffect, useState, useCallback } from "react"
import Header from "../ui/Header"
import { Employee } from "@/types/employee"
import { apiFetch } from "@/lib/api"
import Table from "../ui/Table"
import TeamReimbursementForm from "../reimbursements/TeamReimbursementForm"
import Button from "../ui/Button"
import { Pagination } from "../Pagination"
import { Users, UserPlus } from "lucide-react"

type ManagerPageProps = {
    managerId: string;
    name: string
};

export default function ManagerPage({ managerId, name }:Readonly <ManagerPageProps>) {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [department, setDepartment] = useState("")
    const [search, setSearch] = useState("")
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [showForm, setShowForm] = useState(false)

    const pageSize = 10

    const fetchEmployees = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                size: pageSize.toString(),
            })

            if (search) {
                params.set("name", search)
            } else if (department) {
                params.set("department", department)
            }

            const endpoint = search
                ? `/api/users/search?${params}`
                : `/api/users?${params}`

            const data = await apiFetch(endpoint)
            const list = Array.isArray(data) ? data : data?.content || []
            setEmployees(list)
            setTotalPages(Array.isArray(data) ? 1 : data?.totalPages || 1)
        } catch (error) {
            console.error("Fetch failed", error)
        } finally {
            setLoading(false)
        }
    }, [department, search, currentPage])

    useEffect(() => {
        setCurrentPage(0)
    }, [department, search])

    useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const toggleSelect = (id: string) => {
        setSelectedEmployeeIds((prev) =>
            prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
        )
    }

    const selectedEmployees = employees.filter(e => selectedEmployeeIds.includes(e.id))

    const columns = [
        {
            header: "Select",
            render: (e: Employee) => (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={selectedEmployeeIds.includes(e.id)}
                    onChange={() => toggleSelect(e.id)}
                />
            ),
        },
        {
            header: "Employee Details",
            render: (e: Employee) => (
                <div className="flex flex-col py-1">
                    <span className="font-semibold text-gray-900 leading-tight">{e.name}</span>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{e.employeeId}</span>
                </div>
            )
        },
        {
            header: "Contact Info",
            render: (e: Employee) => <span className="text-gray-600 text-sm">{e.email}</span>
        },
        {
            header: "Department",
            render: (e: Employee) => (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide bg-gray-50 text-gray-600 border-gray-200">
                    {e.department.replaceAll("_", " ")}
                </span>
            )
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
            {/* Top Header / Navigation */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <Header
                    title="Team Management"
                    onDepartmentChange={setDepartment}
                    search={search}
                    onSearchChange={setSearch}
                    options={[
                        { label: "All Departments", value: "" },
                        { label: "Development", value: "DEVELOPMENT" },
                        { label: "QA", value: "QA" },
                        { label: "Business Analyst", value: "BA" },
                        { label: "Finance", value: "FINANCE" },
                        { label: "Digital Marketing", value: "DIGITAL_MARKETING" },
                        { label: "UI/UX", value: "UI_UX" },
                    ]}
                />
            </div>

            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 pb-32">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                                <Users className="text-black" size={25} />
                                Employee List
                            </h2>
                            <p className="text-gray-500 mt-1">Select team members to process group reimbursements</p>
                        </div>

                        <Button
                            onClick={() => setShowForm(true)}
                            disabled={selectedEmployeeIds.length === 0 || loading}
                            variant="secondary"
                            className="shadow-md"
                        >
                            <UserPlus size={12} className="mr-2" />
                            Request Reimbursement ({selectedEmployeeIds.length})
                        </Button>
                    </div>

                    {/* Table Container */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
                        <Table
                            data={employees}
                            columns={columns}
                            loading={loading}
                            emptyMessage="No employees found matching your criteria."
                        />
                    </div>
                </div>
            </main>

            {/* Sticky Pagination Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md py-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-10">
                <div className="flex justify-center items-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        loading={loading}
                    />
                </div>
            </footer>

            {/* Modal Form */}
            {showForm && (
                <TeamReimbursementForm
                    selectedEmployees={selectedEmployees}
                    onClose={() => setShowForm(false)}
                    submittedBy={managerId}
                    managerName={name}
                    loading={loading}
                    onSubmit={async (payload) => {
                        try {
                            setLoading(true);
                            await apiFetch("/api/reimbursements/team", {
                                method: "POST",
                                body: JSON.stringify(payload),
                            });
                            setSelectedEmployeeIds([]);
                            setShowForm(false);
                            alert("Team reimbursement submitted successfully!");
                        } catch (error) {
                            console.error("Submission error:", error);
                            alert("Failed to submit team reimbursement request.");
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
            )}
        </div>
    )
}