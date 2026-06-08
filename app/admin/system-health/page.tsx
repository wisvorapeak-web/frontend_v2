"use client";

import { useState, useEffect } from "react";
import { Activity, Server, Database, Mail, Clock, Cpu, CheckCircle2, AlertCircle } from "lucide-react";

export default function SystemHealth() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      // The health endpoint is at the root of the API server, not /api/
      // fetchApi appends to NEXT_PUBLIC_API_URL which is .../api
      // So we need to fetch .../ instead of .../api/
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const rootUrl = API_BASE.replace(/\/api\/?$/, '/');
      const res = await fetch(rootUrl);
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      console.error("Failed to fetch health", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !health) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading system health...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-12">
      <div className="mb-8 border-b border-border pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase mb-2">
            System Health
          </h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
            Real-time server performance and background jobs
          </p>
        </div>
        <div className="flex items-center gap-2">
           {health?.status === 'OK' ? (
             <span className="flex items-center text-emerald-500 font-bold text-sm bg-emerald-500/10 px-3 py-1.5 rounded-full">
               <CheckCircle2 className="w-4 h-4 mr-2" />
               SYSTEM OPERATIONAL
             </span>
           ) : (
             <span className="flex items-center text-rose-500 font-bold text-sm bg-rose-500/10 px-3 py-1.5 rounded-full">
               <AlertCircle className="w-4 h-4 mr-2" />
               SYSTEM DEGRADED
             </span>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HealthCard 
          title="Uptime" 
          value={health ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : '...'} 
          icon={<Clock className="w-5 h-5 text-indigo-400" />} 
        />
        <HealthCard 
          title="Node Version" 
          value={health?.nodeVersion || '...'} 
          icon={<Server className="w-5 h-5 text-slate-400" />} 
        />
        <HealthCard 
          title="Memory (RSS)" 
          value={health?.memoryUsage?.rss || '...'} 
          icon={<Cpu className="w-5 h-5 text-amber-400" />} 
        />
        <HealthCard 
          title="Database Status" 
          value={health?.database?.status || '...'} 
          icon={<Database className="w-5 h-5 text-emerald-400" />} 
        />
      </div>

      {health?.emailProgress && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center text-lg font-bold text-foreground tracking-tight">
              <Mail className="w-5 h-5 mr-3 text-primary/70" />
              EMAIL DISPATCH PROGRESS
            </h2>
            {health.emailProgress.isActive ? (
              <span className="animate-pulse flex items-center text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                IN PROGRESS
              </span>
            ) : (
              <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-500/10 px-2 py-1 rounded">
                IDLE
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex justify-between text-sm font-bold text-muted-foreground uppercase">
              <span>Total: {health.emailProgress.total}</span>
              <span className="text-emerald-500">Sent: {health.emailProgress.sent}</span>
              <span className="text-rose-500">Failed: {health.emailProgress.failed}</span>
            </div>
            
            <div className="w-full bg-muted/30 rounded-full h-4 border border-border overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500 ease-out" 
                style={{ width: health.emailProgress.total > 0 ? `${(health.emailProgress.sent / health.emailProgress.total) * 100}%` : '0%' }}
              ></div>
            </div>

            <div className="text-xs text-muted-foreground text-right font-medium">
              Last Updated: {health.emailProgress.lastUpdated ? new Date(health.emailProgress.lastUpdated).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HealthCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card backdrop-blur-xl p-6 shadow-sm hover:border-primary/20 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      </div>
    </div>
  );
}
