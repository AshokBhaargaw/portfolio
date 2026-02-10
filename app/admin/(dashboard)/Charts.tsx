"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export default function Charts({ data }: any) {
  if (!data.daily.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-gray-400">
        No analytics data yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
      {/* Events Over Time */}
      <div className="lg:col-span-8">
        <Card title="Events Over Time">
          <div className="overflow-x-auto flex items-center justify-end -ml-2 -mr-2 ">
            <div
              className="min-w-105 px-2 "
              style={{
                minWidth: Math.max(420, data.daily.length * 28),
              }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={data.daily.map((d: any) => ({
                    date: d._id.slice(5), // MM-DD for mobile
                    count: d.count,
                  }))}
                >
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Line dataKey="count" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Devices */}
      <div className="lg:col-span-4">
        <Card title="Devices">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.devices.map((d: any) => ({
                  name: d._id,
                  value: d.count,
                }))}
                dataKey="value"
                nameKey="name"
                outerRadius={70}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Page Views (scrollable on mobile) */}
      <div className="lg:col-span-12">
        <Card title="Page Views">
          <div className="overflow-x-auto -ml-7 ">
            <div className="min-w-[500px]">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data.pageViews.map((p: any) => ({
                    path: p._id.replace("/", ""),
                    count: p.count,
                  }))}
                >
                  <XAxis dataKey="path" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur">
      <h2 className="mb-3 text-xs sm:text-sm font-medium text-gray-300">
        {title}
      </h2>
      {children}
    </div>
  );
}
