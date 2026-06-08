"use client";

import { PageHeader } from "@/components/admin/PageHeader";

export default function Page() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Retry" 
        description="Manage retry settings and configurations."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Retry', href: '/admin/failed-payments/retry' }]}
      />
      <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 shadow-2xl flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl opacity-50">🚧</span>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Module Under Construction</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            The Retry module has been scaffolded and is awaiting backend integration and specific business logic implementation.
          </p>
        </div>
      </div>
    </div>
  );
}
