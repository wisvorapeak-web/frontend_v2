"use client";

import { 
  Users, DollarSign, Calendar, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";



export default function OverviewPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    registrations: 0,
    scheduledSessions: 0,
    activeUsers: 0,
    revenueData: [],
    registrationData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchApi('/stats/overview');
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (e) {
        console.error("Failed to load stats", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Panel</h1>
          <p className="text-slate-400 mt-1">Monitor the performance of your summits and expos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-md bg-primary/5 border border-border text-sm font-medium hover:bg-primary/10 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Revenue" 
          value={loading ? "..." : `$${stats.revenue.toLocaleString()}`} 
          trend="+12.5%" 
          isPositive={true} 
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />} 
        />
        <KpiCard 
          title="Active Registrations" 
          value={loading ? "..." : stats.registrations.toLocaleString()} 
          trend="+8.2%" 
          isPositive={true} 
          icon={<Users className="w-5 h-5 text-indigo-400" />} 
        />
        <KpiCard 
          title="Scheduled Sessions" 
          value={loading ? "..." : stats.scheduledSessions.toString()} 
          trend="-2.4%" 
          isPositive={false} 
          icon={<Calendar className="w-5 h-5 text-amber-400" />} 
        />
        <KpiCard 
          title="Active Users" 
          value={loading ? "..." : stats.activeUsers.toLocaleString()} 
          trend="+24.1%" 
          isPositive={true} 
          icon={<Activity className="w-5 h-5 text-pink-400" />} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-foreground">Revenue Analytics</h2>
            <select className="bg-transparent border border-border text-sm rounded-md px-2 py-1 text-muted-foreground focus:outline-none focus:border-primary/50">
              <option>Last 7 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={stats.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2CC8E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2CC8E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(7, 27, 58, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="total" stroke="#2CC8E5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Registration Chart */}
        <div className="rounded-xl border border-border bg-card backdrop-blur-xl p-6 shadow-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-foreground">Registrations</h2>
          </div>
          <div className="h-[300px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart data={stats.registrationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: 'rgba(7, 27, 58, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="visitors" fill="#2CC8E5" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="exhibitors" fill="#D6A85F" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

function KpiCard({ title, value, trend, isPositive, icon }: { title: string, value: string, trend: string, isPositive: boolean, icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card backdrop-blur-xl p-6 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-colors">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
          {icon}
        </div>
        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trend}
        </div>
      </div>
      
      <div>
        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      </div>
    </div>
  );
}
