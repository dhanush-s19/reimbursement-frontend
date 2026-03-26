"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  FileCheck,
  UsersRound,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "../ui/Card";
import { apiFetch } from "@/lib/api";
import Button from "../ui/Button";

interface HrStats {
  pendingHrVerificationCount: number;
  totalEmployees: number;
  pendingByType: Record<string, number>;
}

const HrDashboard = () => {
  const [stats, setStats] = useState<HrStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHrData = async () => {
      try {
        const data = await apiFetch("/api/users/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to load HR stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHrData();
  }, []);

  const chartData = stats
    ? [
        { name: "Total Staff", count: stats.totalEmployees, color: "#111827" },
        {
          name: "Pending",
          count: stats.pendingHrVerificationCount,
          color: "#ef4444",
        },
      ]
    : [];

  if (loading)
    return (
      <div className="p-8 text-gray-500 animate-pulse">
        Loading HR Insights...
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Overview</h1>
          <p className="text-gray-500">
            Manage organizational compliance and employee records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          hoverable
          className="cursor-pointer"
          onClick={() => router.push("/hr/hr-reimbursement-request")}
        >
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl text-red-600">
              <FileCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Pending Verification
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                {stats?.pendingHrVerificationCount || 0}
              </h2>
            </div>
          </Card.Content>
        </Card>

        <Card
          hoverable
          className="cursor-pointer"
          onClick={() => router.push("/hr/events")}
        >
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl text-black">
              <UsersRound size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Team Events Pending
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                {stats?.pendingByType?.["TEAM_EVENTS"] || 0}
              </h2>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl text-gray-900">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Employees
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                {stats?.totalEmployees || 0}
              </h2>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <BarChart3 size={18} /> Compliance Distribution
            </Card.Title>
          </Card.Header>
          <Card.Content className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header className="flex justify-between items-center">
            <div>
              <Card.Title>Verification Queue</Card.Title>
            </div>
            <button
              onClick={() => router.push("/hr/hr-reimbursement-request")}
              className="text-sm font-semibold text-gray-900 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {stats?.pendingHrVerificationCount === 0 ? (
                <p className="text-center py-6 text-gray-400 italic">
                  No pending items.
                </p>
              ) : (
                Object.keys(stats?.pendingByType || {}).map((type) => (
                  <div
                    key={type}
                    className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-xs uppercase tracking-wider">
                        {type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats?.pendingByType?.[type] || 0} Items
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        router.push(`/hr/hr-reimbursement-request`)
                      }
                      className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md font-medium hover:bg-gray-700 transition-all"
                    >
                      Process
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default HrDashboard;
