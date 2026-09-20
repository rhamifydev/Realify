import { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import {
    Bell,
    CheckCircle2,
    CalendarClock,
    Calendar,
    Check,
    ChevronRight,
    Sparkles,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NotificationData = {
    id: string;
    type: string;
    data: {
        title?: string;
        message?: string;
        action_url?: string;
        property_id?: number;
        property_title?: string;
        booking_id?: number;
        inspection_date?: string;
        time_slot?: string;
    };
    created_at: string;
    read_at: string | null;
};

function formatRelativeTime(dateString?: string) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffSeconds < 60) return 'Just now';
        const diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return '';
    }
}

export function NotificationBell({ className = '' }: { className?: string }) {
    const { auth } = usePage().props as any;
    const [open, setOpen] = useState(false);

    if (!auth?.user) return null;

    const notifications: NotificationData[] = auth?.notifications || [];
    const unreadCount: number = auth?.unreadNotificationsCount ?? notifications.length;

    const handleMarkAllRead = () => {
        router.post(
            '/notifications/all/read',
            {},
            {
                preserveScroll: true,
                onSuccess: () => setOpen(false),
            }
        );
    };

    const handleItemClick = (notification: NotificationData) => {
        setOpen(false);
        const targetUrl = notification.data?.action_url || '/tenant/inspections';
        router.post(
            `/notifications/${notification.id}/read`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    router.visit(targetUrl);
                },
            }
        );
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label={`Notifications (${unreadCount} unread)`}
                    className={`relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-blue-900 ${className}`}
                >
                    <Bell className="h-5 w-5" />

                    {/* Unread Badge Count */}
                    {unreadCount > 0 && (
                        <>
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            </span>
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-black text-white ring-2 ring-white dark:ring-zinc-900 shadow-xs">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-[340px] sm:w-[380px] p-0 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 px-4 py-3 bg-slate-50/70 dark:bg-zinc-800/40">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-blue-900 text-white px-2 py-0.5 text-[10px] font-extrabold">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-1 text-[11px] font-bold text-blue-900 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                            <Check className="w-3 h-3" />
                            <span>Mark all read</span>
                        </button>
                    )}
                </div>

                {/* Body List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800 scrollbar-thin">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center space-y-2">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                All caught up!
                            </h4>
                            <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto">
                                No new notifications at the moment. You will be alerted when a viewing time is updated.
                            </p>
                        </div>
                    ) : (
                        notifications.map((n) => {
                            const isRescheduled = n.type.includes('Rescheduled') || n.data?.title?.includes('Rescheduled');
                            const isConfirmed = n.type.includes('Confirmed') || n.data?.title?.includes('Confirmed');

                            return (
                                <button
                                    key={n.id}
                                    type="button"
                                    onClick={() => handleItemClick(n)}
                                    className="w-full text-left p-3.5 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors flex items-start gap-3 cursor-pointer group"
                                >
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-0.5 ${
                                            isRescheduled
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                : isConfirmed
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                        }`}
                                    >
                                        {isRescheduled && <CalendarClock className="h-4 w-4" />}
                                        {isConfirmed && <CheckCircle2 className="h-4 w-4" />}
                                        {!isRescheduled && !isConfirmed && <Calendar className="h-4 w-4" />}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-0.5">
                                        <div className="flex items-center justify-between gap-1">
                                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                                {n.data?.title || 'Inspection Update'}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                                {formatRelativeTime(n.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug">
                                            {n.data?.message || 'New update regarding your property inspection.'}
                                        </p>
                                        {n.data?.inspection_date && (
                                            <p className="text-[10px] font-bold text-blue-900 dark:text-blue-400 mt-1">
                                                📅 {n.data.inspection_date} {n.data.time_slot ? `• ${n.data.time_slot}` : ''}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 dark:border-zinc-800 p-2.5 bg-slate-50/50 dark:bg-zinc-800/20 text-center">
                    <Link
                        href="/tenant/inspections"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-900 dark:text-blue-400 hover:text-blue-800 transition-colors py-1 px-2 rounded-lg"
                    >
                        <span>Go to Inspection Hub</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default NotificationBell;
