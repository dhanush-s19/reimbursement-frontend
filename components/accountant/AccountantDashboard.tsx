"use client";

import React, { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { Wallet, Clock, CheckCircle2, FileText, AlertCircle, Loader2 } from "lucide-react";
import Card from "../ui/Card"; 
import { apiFetch } from "@/lib/api";

interface DashboardStats {
  totalPendingPayout: number;
  pendingApprovalCount: number;
  spendByType: Record<string, number>;
  statusDistribution: Record<string, number>;
}

const COLORS = ["#111827", "#374151", "#6B7280", "#9CA3AF", "#E5E7EB"];

export default function AccountantDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        const stats = await apiFetch("/api/reimbursements/accountant/stats");
        setData(stats);
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Unable to load financial data. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

 
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="text-gray-500 font-medium animate-pulse">Syncing financial records...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-sm">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Data Unavailable</h3>
          <p className="text-gray-500 text-sm mt-2">{error || "No data received."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const pieData = Object.entries(data.spendByType || {}).map(([name, value]) => ({ 
    name: name.replaceAll("_", ' '), 
    value 
  }));
  
  const barData = Object.entries(data.statusDistribution || {}).map(([name, value]) => ({ 
    name: name.replaceAll("_", ' '), 
    value 
  }));

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Overview</h1>
          <p className="text-gray-500 text-sm">Real-time reimbursement analytics and liquidity tracking.</p>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Wallet className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <Card.Description>Total Pending Payout</Card.Description>
              <p className="text-2xl font-bold text-gray-900">
                ${(data.totalPendingPayout || 0).toLocaleString()}
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Clock className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <Card.Description>Awaiting Approval</Card.Description>
              <p className="text-2xl font-bold text-gray-900">
                {data.pendingApprovalCount || 0} Requests
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <Card.Description>Approval Rate</Card.Description>
              <p className="text-2xl font-bold text-gray-900">94.8%</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <FileText className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <Card.Description>Audit Status</Card.Description>
              <p className="text-2xl font-bold text-gray-900">Ready</p>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* --- GRAPHS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Spend by Type - Pie Chart */}
        <Card>
          <Card.Header>
            <Card.Title>Expenditure by Category</Card.Title>
            <Card.Description>Breakdown of total funds disbursed.</Card.Description>
          </Card.Header>
          <Card.Content className="h-80">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 italic">No category data available</div>
            )}
          </Card.Content>
        </Card>

        {/* Status Distribution - Bar Chart */}
        <Card>
          <Card.Header>
            <Card.Title>Workflow Distribution</Card.Title>
            <Card.Description>Current volume across the approval pipeline.</Card.Description>
          </Card.Header>
          <Card.Content className="h-80">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{fill: '#6B7280'}}
                    interval={0}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#F9FAFB'}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#111827" 
                    radius={[4, 4, 0, 0]} 
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 italic">No workflow data available</div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}