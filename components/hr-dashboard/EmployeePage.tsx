"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "../ui/Header";
import { Employee } from "@/types/employee";
import EmployeeModal from "./EmployeeModal";
import { apiFetch } from "@/lib/api";
import EmployeeActions from "./EmployeeActions";
import Table from "../ui/Table";
import { Pagination } from "../Pagination";
import { Pencil, Trash2 } from "lucide-react";
import Toast, { ToastType } from "../ui/Toast";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const pageSize = 10;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
      });

      if (search) params.set("name", search);
      if (department && department !== "") {
        params.set("department", department);
      }

      const endpoint = search
        ? `/api/users/search?${params}`
        : `/api/users?${params}`;

      const data = await apiFetch(endpoint);
      const list = Array.isArray(data) ? data : data?.content || [];
      setEmployees(list);
      setTotalPages(Array.isArray(data) ? 1 : data?.totalPages || 1);
    } catch (error) {
      showToast("Failed to fetch employees", "error");
    } finally {
      setLoading(false);
    }
  }, [department, search, currentPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const deleteEmployee = async (id: string) => {
    try {
      await apiFetch(`/api/users/${id}`, { method: "DELETE" });
      await fetchEmployees();
      showToast("Employee deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete employee", "error");
    }
  };

  const handleSave = async (employee: Employee) => {
    try {
      const method = selectedEmployee ? "PUT" : "POST";
      const url = selectedEmployee ? `/api/users/${employee.id}` : "/api/users";
      if (!employee.department) {
        showToast("Please select a department", "error");
        return;
      }
      await apiFetch(url, {
        method,
        body: JSON.stringify(employee),
      });

      await fetchEmployees();
      setIsModalOpen(false);
      setSelectedEmployee(null);
      showToast(
        `Employee ${selectedEmployee ? "updated" : "created"} successfully`,
        "success"
      );
    } catch (error) {
      showToast("Error saving employee data", "error");
    }
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setCurrentPage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const columns = [
    {
      header: "ID",
      className: "hidden md:table-cell",
      render: (e: Employee) => (
        <span className="font-mono text-xs text-gray-500">{e.employeeId}</span>
      ),
    },
    {
      header: "Employee",
      render: (e: Employee) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{e.name}</span>
          <span className="text-xs text-gray-500 md:hidden">{e.email}</span>
        </div>
      ),
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
              setSelectedEmployee(e);
              setIsModalOpen(true);
            }}
            className="p-2 text-black-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this employee?")) {
                deleteEmployee(e.id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex-none bg-white border-b border-gray-200 z-20 py-2 flex items-center">
        <div className="w-full px-6">
          <Header
            title="Employees"
            role={department}
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
              { label: "Graphic Designer", value: "GRAPHIC_DESIGNER" },
            ]}
            actions={
              <EmployeeActions
                onAdd={() => {
                  setSelectedEmployee(null);
                  setIsModalOpen(true);
                }}
              />
            }
          />
        </div>
      </div>

      <main className="flex-1 overflow-auto bg-white">
        <div className="w-full">
          <Table
            data={employees}
            columns={columns}
            loading={loading}
            emptyMessage="No employees matching your search criteria."
          />
        </div>
      </main>

      <footer className="flex-none bg-white border-t border-gray-200 py-3 px-6 z-30">
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        </div>
      </footer>

      <EmployeeModal
        open={isModalOpen}
        employee={selectedEmployee}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}