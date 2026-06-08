"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  LayoutDashboard, FileText, Users, CreditCard, 
  AlertCircle, DollarSign, BookOpen, Inbox, 
  Mail, Award, LayoutTemplate, MessageSquare, 
  MapPin, Calendar, Settings, ShieldCheck, UserCog, LogOut, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
  { name: 'Abstracts', href: '/admin/abstracts', icon: FileText },
  { name: 'Speakers', href: '/admin/speakers', icon: Users },
  { name: 'Registrations', href: '/admin/registrations', icon: FileText },
  { name: 'Failed Payments', href: '/admin/failed-payments', icon: AlertCircle },
  { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
  { name: 'Brochures', href: '/admin/brochures', icon: BookOpen },
  { name: 'Inbox', href: '/admin/inbox', icon: Inbox },
  { name: 'Send Emails', href: '/admin/send-emails', icon: Mail },
  { name: 'Sponsors', href: '/admin/sponsors', icon: Award },
  { name: 'Content', href: '/admin/content', icon: LayoutTemplate },
  { name: 'Topics', href: '/admin/topics', icon: MessageSquare },
  { name: 'Venue Gallery', href: '/admin/venue-gallery', icon: MapPin },
  { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Organizers', href: '/admin/organizers', icon: UserCog },
  { name: 'Users', href: '/admin/users', icon: UserCog },
  { name: 'System Health', href: '/admin/system-health', icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background/80 backdrop-blur-2xl transition-transform sm:translate-x-0">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="font-bold text-xl tracking-tight text-foreground flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs text-primary-foreground">A</div>
          Ascendix
        </div>
      </div>
      <div className="h-[calc(100vh-8rem)] overflow-y-auto py-4 px-3 custom-scrollbar">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-primary/20 text-primary" 
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 mr-3 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-border bg-background/90 backdrop-blur-md">
        <button 
          onClick={() => {
            Cookies.remove('admin_token');
            window.location.href = '/login';
          }}
          className="flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-rose-400 bg-rose-400/10 hover:bg-rose-400/20 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}
