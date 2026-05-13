import React from 'react';
import LocationList from './LocationList';
import LocationForm from './LocationForm';
import { MapPin } from "lucide-react";

export const locationRoutes = [
    {
        title: "Location Master",
        path: "/location",
        element: <LocationList />,
        showInSidebar: true,
        icon: <MapPin size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Location",
        path: "/location/add",
        element: <LocationForm />,
        showInSidebar: false
    },
    {
        title: "Edit Location",
        path: "/location/edit/:id",
        element: <LocationForm />,
        showInSidebar: false
    }
];
