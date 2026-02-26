"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard, UtensilsCrossed, CalendarCheck, Bed,
    ImageIcon, MessageSquare, LogOut, ChefHat, Settings, FileText, CalendarRange,
    Compass, Tag, Waves
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/rooms", label: "Rooms", icon: Bed },
    { href: "/reservations", label: "Reservations", icon: CalendarCheck },
    { href: "/availability", label: "Availability", icon: CalendarRange },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/experiences", label: "Experiences", icon: Compass },
    { href: "/offers", label: "Special Offers", icon: Tag },
    { href: "/spa", label: "Spa Treatments", icon: Waves },
    { href: "/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/content", label: "Site Content", icon: FileText },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-slate-950">
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <ChefHat className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-white text-sm font-semibold tracking-tight">Grand Horizon</h2>
                            <p className="text-slate-500 text-[0.65rem] uppercase tracking-widest">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-none ${isActive
                                    ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-400"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800 border-l-2 border-transparent"
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-1">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full border-l-2 border-transparent"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-64">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
