'use client'
import { Employee } from "@/types/employee";
import React, { useState } from "react";
import Button from "../ui/Button";

interface Props {
    selectedEmployees: Employee[];
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        amount: number;
        description: string;
        submittedById: string;
        name: string;
        teamMemberIds: string[];
        type: string;
    }) => void;
    loading?: boolean;
    submittedBy: string;
    managerName: string;
}

export default function TeamReimbursementForm({
    selectedEmployees,
    onClose,
    onSubmit,
    loading = false,
    submittedBy,
    managerName
}: Readonly<Props>) {
    const [formData, setFormData] = useState({ title: "", amount: "", description: "" });

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.title || !formData.amount) {
            alert("Title and amount are required");
            return;
        }



        const payload = {
            title: formData.title,
            amount: parseFloat(formData.amount),
            description: formData.description,
            submittedById: submittedBy,
            name: managerName,
            teamMemberIds: selectedEmployees.map(emp => emp.id),
            type: "TEAM_EVENTS"
        };

        try {
            await onSubmit(payload);
        } catch (err: any) {
            alert(err.message || "Failed to submit reimbursement");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md flex flex-col gap-5 p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                        Team Reimbursement
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Fill in the event details below</p>
                </div>

                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1 custom-scrollbar">
                    {selectedEmployees.map((employee) => (
                        <span
                            key={employee.id}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-black text-xs font-semibold border border-indigo-100 transition-colors"
                        >
                            {employee.name}
                        </span>
                    ))}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Team Lunch"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Total Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Notes</label>
                        <textarea
                            placeholder="Provide any additional context..."
                            rows={3}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="secondary"
                        type="submit"
                        disabled={loading}
                        className={`flex-1 px-4 py-3 text-sm font-semibold text-white rounded-xl transition-all shadow-md 
                            ${loading
                                ? 'cursor-not-allowed'
                                : 'from-indigo-600 to-violet-600 hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </div>
            </form>
        </div>
    );
}