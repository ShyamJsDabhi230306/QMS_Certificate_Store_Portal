import React from 'react';

import ReminderCenter from './ReminderCenter';

import {
    BellRing
} from "lucide-react";

export const reminderRoutes = [

   {
        title: "Reminder Center",
        pageCode: "REMINDER_CENTER",
        path: "/reminder-center",
        element: <ReminderCenter />,
        showInSidebar: true,
        icon: <BellRing size={18} strokeWidth={2.5} />
    }
];