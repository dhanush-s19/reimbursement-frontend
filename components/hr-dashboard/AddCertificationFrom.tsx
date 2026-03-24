"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Certification } from "@/types/certification";
import Button from "../ui/Button";

const roles = [
  "Developers",
  "Architects",
  "DevOps",
  "BA/PM",
  "Product Management",
];

interface AddCertificationFormProps {
  onAdded?: () => void; 
}

export default function AddCertificationForm({ onAdded }: Readonly<AddCertificationFormProps>) {
  const [form, setForm] = useState<Certification>({
    category: "Cloud",
    certification: "",
    recommendedRoles: [],
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field: keyof Certification, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      recommendedRoles: prev.recommendedRoles.includes(role)
        ? prev.recommendedRoles.filter((r) => r !== role)
        : [...prev.recommendedRoles, role],
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await apiFetch("/api/certifications/add", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setMessage("Certification added successfully");
      setForm({
        category: "Cloud",
        certification: "",
        recommendedRoles: [],
        status: "Active",
      });

      onAdded?.();
    } catch (err) {
      setMessage("Failed to add certification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl p-6 bg-white shadow rounded space-y-4"
    >
      <h2 className="text-xl font-semibold">Add Certification</h2>

      {/* Category */}
      <div>
        <label htmlFor="select" className="block text-sm font-medium">Category</label>
        <select
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option>Cloud</option>
          <option>AI</option>
          <option>Data</option>
          <option>Security</option>
        </select>
      </div>

      {/* Certification Name */}
      <div>
        <label htmlFor="text" className="block text-sm font-medium">Certification Name</label>
        <input
          type="text"
          value={form.certification}
          onChange={(e) => handleChange("certification", e.target.value)}
          placeholder="Microsoft Azure Fundamentals - AZ-900"
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Recommended Roles */}
      <div>
        <label htmlFor="input" className="block text-sm font-medium mb-2">Recommended Roles</label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((role) => (
            <label key={role} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.recommendedRoles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              {role}
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="select" className="block text-sm font-medium">Status</label>
        <select
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Submit */}
      <Button
        variant="secondary"
        type="submit"
        disabled={loading}
        className="text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Certification"}
      </Button>

      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </form>
  );
}