import { Sidebar } from '@/components/admin/Sidebar';
import { Bell, Search, UserCircle } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Sidebar />
      <div className="sm:ml-64">
        {/* Topbar */}
        <header className="fixed top-0 right-0 z-30 flex h-16 w-full sm:w-[calc(100%-16rem)] items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-2xl">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search across ecosystem..."
                className="h-9 w-full rounded-md border border-border bg-white/5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center cursor-pointer border border-border">
              <UserCircle className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8 mt-16">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
