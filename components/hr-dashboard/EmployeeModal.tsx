"use client"

import { useState, useEffect, useCallback } from "react"
import { Employee } from "@/types/employee"
import Button from "../ui/Button"

interface Props {
  open: boolean
  onClose: () => void
  onSave: (employee: Employee) => Promise<void>
  employee?: Employee | null
}

const defaultForm = {
  id: "",
  employeeId: "",
  name: "",
  email: "",
  password: "",
  role: "EMPLOYEE",
  department: "DEVELOPMENT",
}

export default function EmployeeFormModal({ open, onClose, employee, onSave }: Readonly<Props>) {
  const [form, setForm] = useState<Employee | typeof defaultForm>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(employee ? { ...employee, password: "" } : defaultForm)
    setErrors({})
  }, [open, employee])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.employeeId.trim()) newErrors.employeeId = "Employee ID is required"

    if (!form.name.trim()) {
      newErrors.name = "Name is required"
    } else if (form.name.length < 2 || form.name.length > 100) {
      newErrors.name = "Name must be between 2 and 100 characters"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format"
    }


    if (!employee) {
      if (!form.password) {
        newErrors.password = "Password is required"
      } else if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long"
      }
    }

    if (!form.department) newErrors.department = "Department is required"
    if (!form.role) newErrors.role = "Role is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setForm(prev => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }))
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(async () => {
    if (!validate()) return

    setLoading(true)
    try {
      const payload = { ...form }
      if (employee) {
        delete (payload as any).password
      }

      await onSave(payload as Employee)
      onClose()
    } catch (error) {
      console.error("Failed to save employee", error)
    } finally {
      setLoading(false)
    }
  }, [form, onSave, onClose, employee])

  if (!open) return null

  const inputFields = ["employeeId", "name", "email", "password"].filter(
    field => !(employee && field === "password")
  )

  let buttonText;

  if (loading) {
    buttonText = "Saving...";
  } else if (employee) {
    buttonText = "Update Employee";
  } else {
    buttonText = "Save Employee";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {employee ? "Edit Employee" : "Add New Employee"}
          </h2>
          <p className="text-sm text-gray-500">Enter the details below to manage the staff member.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 gap-4">
            {inputFields.map(field => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {field === "employeeId" ? "Employee ID" : field}
                </label>
                <input
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  placeholder={field === "employeeId" ? "e.g. EMP-001" : `Enter ${field}`}
                  className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${errors[field] ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  type={field === "password" ? "password" : "text"}
                />
                {errors[field] && <span className="text-xs text-red-500">{errors[field]}</span>}
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="HR">Hr</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ACCOUNTANT">Accountant</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="department" className="text-sm font-medium text-gray-700">Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="DEVELOPMENT">Development</option>
                  <option value="QA">QA</option>
                  <option value="BA">BA</option>
                  <option value="FINANCE">Finance</option>
                  <option value="DIGITAL_MARKETING">Digital Marketing</option>
                  <option value="UI_UX">UI/UX</option>
                  <option value="HR">HR</option>
                  <option value="GRAPHIC_DESIGNER">Graphic Designer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto px-6 py-2.5">
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-2.5 text-white hover:bg-gray-700 disabled"
            disabled={loading}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}