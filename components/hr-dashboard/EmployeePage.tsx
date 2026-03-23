"use client"

import { useEffect, useState, useCallback } from "react"
import Header from "../ui/Header"
import { Employee } from "@/types/employee"
import EmployeeModal from "./EmployeeModal"
import { apiFetch } from "@/lib/api"
import EmployeeActions from "./EmployeeActions"
import Table from "../ui/Table"
import { Pagination } from "../Pagination"


export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [department, setDepartment] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const pageSize = 10

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
      })

      if (search) params.set("name", search)
      if (department) params.set("department", department)

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
    fetchEmployees()
  }, [fetchEmployees])

  const handleDepartmentChange = (value: string) => {
    setDepartment(value)
    setCurrentPage(0)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(0)
  }

  const deleteEmployee = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await apiFetch(`/api/users/${id}`, { method: "DELETE" })
      
      await fetchEmployees()

    } catch (error) {
      console.error(error)
    }
  }

  const handleSave = async (employee: Employee) => {
    try {
      const method = selectedEmployee ? "PUT" : "POST"
      const url = selectedEmployee
        ? `/api/users/${employee.id}`
        : "/api/users"

      await apiFetch(url, {
        method,
        body: JSON.stringify(employee),
      })

      await fetchEmployees()
      setIsModalOpen(false)
      setSelectedEmployee(null)

    } catch (error) {
      console.error(error)
    }
  }

  const columns = [
    {
      header: "ID",
      className: "hidden md:table-cell",
      render: (e: Employee) => (
        <span className="font-mono text-xs text-gray-500">
          {e.employeeId}
        </span>
      ),
    },
    {
      header: "Employee",
      render: (e: Employee) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {e.name}
          </span>
          <span className="text-xs text-gray-500 md:hidden">
            {e.email}
          </span>
        </div>
      ),
    },
    {
      header: "Email",
      className: "hidden md:table-cell",
      render: (e: Employee) => e.email,
    },
    {
      header: "Dept",
      render: (e: Employee) => (
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-900 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
          {e.department.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (e: Employee) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => {
              setSelectedEmployee(e)
              setIsModalOpen(true)
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit"
          >
            Edit
          </button>

          <button
            onClick={() => deleteEmployee(e.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 overflow-x-hidden">
      
      <Header
        title="Employees"
        role="ADMIN"
        onDepartmentChange={handleDepartmentChange}
        search={search}
        onSearchChange={handleSearchChange}
        options={[
          { label: "All Departments", value: "" },
          { label: "HR", value: "HR" },
          { label: "Development", value: "DEVELOPMENT" },
          { label: "QA", value: "QA" },
          { label: "Business Analyst", value: "BA" },
          { label: "Finance", value: "FINANCE" },
          { label: "Marketing", value: "DIGITAL_MARKETING" },
          { label: "UI/UX", value: "UI_UX" },
        ]}
        actions={
          <EmployeeActions
            onAdd={() => {
              setSelectedEmployee(null)
              setIsModalOpen(true)
            }}
          />
        }
      />

      <main className="flex-1 p-3 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              data={employees}
              columns={columns}
              loading={loading}
              emptyMessage="No employees matching your criteria"
            />
          </div>
        </div>
      </main>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <EmployeeModal
        open={isModalOpen}
        employee={selectedEmployee}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}