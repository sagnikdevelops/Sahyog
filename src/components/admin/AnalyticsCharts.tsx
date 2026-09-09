"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AnalyticsCharts() {
  const tradeDemandData = [
    { trade: "Plumbing", bookings: 42, completed: 38 },
    { trade: "Electrical", bookings: 36, completed: 34 },
    { trade: "Carpentry", bookings: 22, completed: 20 },
    { trade: "Cleaning", bookings: 30, completed: 28 },
    { trade: "Painting", bookings: 16, completed: 14 },
    { trade: "Caregiving", bookings: 18, completed: 18 },
    { trade: "Technical", bookings: 24, completed: 22 },
  ];

  const weeklyTrendData = [
    { day: "Mon", scheduled: 12, emergency: 3 },
    { day: "Tue", scheduled: 15, emergency: 4 },
    { day: "Wed", scheduled: 18, emergency: 6 },
    { day: "Thu", scheduled: 14, emergency: 2 },
    { day: "Fri", scheduled: 20, emergency: 5 },
    { day: "Sat", scheduled: 28, emergency: 9 },
    { day: "Sun", scheduled: 25, emergency: 8 },
  ];

  const feeDistributionData = [
    { name: "Direct Worker Share (88%)", value: 88, color: "#047857" },
    { name: "Cooperative Welfare Fund (7%)", value: 7, color: "#34D399" },
    { name: "Platform Operations (5%)", value: 5, color: "#142D52" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Trade Demand */}
      <Card className="border-[#E5E7EB] bg-white">
        <CardHeader className="p-4 border-b border-[#E5E7EB]">
          <CardTitle className="text-xs font-bold text-[#142D52] uppercase tracking-wider">
            Service Demand by Trade Category
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tradeDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="trade" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#142D52", color: "#FFFFFF", borderRadius: "6px", border: "1px solid #142D52", fontSize: "11px" }}
              />
              <Bar dataKey="bookings" name="Bookings" fill="#142D52" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#047857" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Weekly Trends */}
      <Card className="border-[#E5E7EB] bg-white">
        <CardHeader className="p-4 border-b border-[#E5E7EB]">
          <CardTitle className="text-xs font-bold text-[#142D52] uppercase tracking-wider">
            7-Day Booking Trend (Standard vs. Emergency)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#142D52", color: "#FFFFFF", borderRadius: "6px", border: "1px solid #142D52", fontSize: "11px" }}
              />
              <Line type="monotone" dataKey="scheduled" name="Standard" stroke="#142D52" strokeWidth={2} />
              <Line type="monotone" dataKey="emergency" name="Emergency" stroke="#DC2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart 3: Revenue & Fee Split */}
      <Card className="border-[#E5E7EB] bg-white lg:col-span-2">
        <CardHeader className="p-4 border-b border-[#E5E7EB]">
          <CardTitle className="text-xs font-bold text-[#142D52] uppercase tracking-wider">
            Cooperative Revenue Transparency Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-around h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={feeDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {feeDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#142D52", color: "#FFFFFF", borderRadius: "6px", border: "1px solid #142D52", fontSize: "11px" }}
              />
              <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}