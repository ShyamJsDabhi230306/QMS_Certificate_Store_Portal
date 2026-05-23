import React, { useEffect, useState } from 'react';

import {
    BellRing,
    CalendarDays,
    AlertTriangle,
    ShieldAlert
} from 'lucide-react';

import toast from 'react-hot-toast';

import { certificateReminderService }
from '@/api/certificateReminderService';

const ReminderCenter = () => {

    // =====================================
    // STATE
    // =====================================
    const [reminders, setReminders] = useState([]);

    const [loading, setLoading] = useState(true);

    // =====================================
    // LOAD
    // =====================================
    useEffect(() => {

        loadReminders();

    }, []);

    // =====================================
    // API
    // =====================================
    const loadReminders = async () => {

        try {

            setLoading(true);

            const res =
                await certificateReminderService
                    .getPendingReminders();

            if (res.success) {

                setReminders(res.data || []);
            }

        } catch {

            toast.error(
                "Failed to load reminders"
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================
    // COUNTS
    // =====================================
    const expiring7Days =
        reminders.filter(x => x.daysLeft <= 7).length;

    const expiring30Days =
        reminders.filter(x => x.daysLeft <= 30).length;

    const expired =
        reminders.filter(x => x.daysLeft < 0).length;

    // =====================================
    // LOADING
    // =====================================
    if (loading) {

        return (

            <div
                className="
                    h-[80vh]
                    flex
                    items-center
                    justify-center
                    
                "
            >

                <div
                    className="
                        h-14
                        w-14
                        rounded-full
                        border-4
                        border-gold
                        border-t-transparent
                        animate-spin
                    "
                />

            </div>
        );
    }

    return (

        <div className="space-y-6 p-8">

            {/* ===================================== */}
            {/* HEADER */}
            {/* ===================================== */}
            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-3xl
                            font-black
                            tracking-tight
                        "
                    >
                        Reminder Center
                    </h1>

                    <p
                        className="
                            text-muted-foreground
                            mt-2
                        "
                    >
                        Monitor certificate expiry
                        reminders and alerts
                    </p>

                </div>

            </div>

            {/* ===================================== */}
            {/* STATS */}
            {/* ===================================== */}
            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-6
                "
            >

                {/* 7 DAYS */}
                <div
                    className="
                        rounded-3xl
                        border
                        border-border/50
                        bg-card
                        p-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-muted-foreground
                                    font-bold
                                "
                            >
                                Expiring in 7 Days
                            </p>

                            <h2
                                className="
                                    text-4xl
                                    font-black
                                    mt-3
                                    text-red-500
                                "
                            >
                                {expiring7Days}
                            </h2>

                        </div>

                        <AlertTriangle
                            size={38}
                            className="
                                text-red-500
                            "
                        />

                    </div>

                </div>

                {/* 30 DAYS */}
                <div
                    className="
                        rounded-3xl
                        border
                        border-border/50
                        bg-card
                        p-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-muted-foreground
                                    font-bold
                                "
                            >
                                Expiring in 30 Days
                            </p>

                            <h2
                                className="
                                    text-4xl
                                    font-black
                                    mt-3
                                    text-yellow-500
                                "
                            >
                                {expiring30Days}
                            </h2>

                        </div>

                        <CalendarDays
                            size={38}
                            className="
                                text-yellow-500
                            "
                        />

                    </div>

                </div>

                {/* EXPIRED */}
                <div
                    className="
                        rounded-3xl
                        border
                        border-border/50
                        bg-card
                        p-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-muted-foreground
                                    font-bold
                                "
                            >
                                Expired Certificates
                            </p>

                            <h2
                                className="
                                    text-4xl
                                    font-black
                                    mt-3
                                    text-destructive
                                "
                            >
                                {expired}
                            </h2>

                        </div>

                        <ShieldAlert
                            size={38}
                            className="
                                text-destructive
                            "
                        />

                    </div>

                </div>

            </div>

            {/* ===================================== */}
            {/* TABLE */}
            {/* ===================================== */}
            <div
                className="
                    rounded-3xl
                    border
                    border-border/50
                    bg-card
                    overflow-hidden
                "
            >

                {/* HEADER */}
                <div
                    className="
                        px-6
                        py-5
                        border-b
                        border-border/50
                        flex
                        items-center
                        gap-3
                    "
                >

                    <BellRing
                        size={20}
                        className="
                            text-gold
                        "
                    />

                    <h2
                        className="
                            text-sm
                            font-black
                            uppercase
                            tracking-[0.2em]
                        "
                    >
                        Pending Reminders
                    </h2>

                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead
                            className="
                                bg-muted/30
                            "
                        >

                            <tr>

                                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest">
                                    Certificate
                                </th>

                                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest">
                                    Expiry Date
                                </th>

                                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest">
                                    Reminder
                                </th>

                                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest">
                                    Channel
                                </th>

                                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest">
                                    Days Left
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                reminders.map((item) => (

                                    <tr
                                        key={item.idReminder}
                                        className="
                                            border-t
                                            border-border/40
                                            hover:bg-muted/20
                                            transition-all
                                        "
                                    >

                                        <td className="px-6 py-5">

                                            <div>

                                                <h3
                                                    className="
                                                        font-bold
                                                    "
                                                >
                                                    {item.certificateName}
                                                </h3>

                                                <p
                                                    className="
                                                        text-xs
                                                        text-muted-foreground
                                                        mt-1
                                                    "
                                                >
                                                    {item.certificateNumber}
                                                </p>

                                            </div>

                                        </td>

                                        <td className="px-6 py-5 text-sm">

                                            {
                                                item.expiryDate
                                                    ?.split('T')[0]
                                            }

                                        </td>

                                        <td className="px-6 py-5">

                                            <div
                                                className="
                                                    inline-flex
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-yellow-500/10
                                                    text-yellow-500
                                                    text-xs
                                                    font-black
                                                "
                                            >
                                                {
                                                    item.daysBeforeExpiry
                                                } Days Before
                                            </div>

                                        </td>

                                        <td className="px-6 py-5 text-sm">

                                            {item.channel}

                                        </td>

                                        <td className="px-6 py-5">

                                            <div
                                                className="
                                                    inline-flex
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-red-500/10
                                                    text-red-500
                                                    text-xs
                                                    font-black
                                                "
                                            >
                                                {
                                                    item.daysLeft
                                                } Days
                                            </div>

                                        </td>

                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default ReminderCenter;