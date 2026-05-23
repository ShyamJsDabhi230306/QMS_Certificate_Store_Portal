import React from 'react';

import ReminderCenter from './ReminderCenter';

import {
    BellRing
} from "lucide-react";

export const reminderRoutes = [

    {
        title: "Reminder Center",

        path: "/reminder-center",

        element: <ReminderCenter />,

        showInSidebar: true,

        icon: <BellRing size={18} strokeWidth={2.5} />
    }
];