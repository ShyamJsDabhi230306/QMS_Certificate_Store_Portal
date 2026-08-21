import React from 'react';
import LocationList from './LocationList';
import LocationForm from './LocationForm';
import { MapPin } from "lucide-react";

export const locationRoutes = [
   {
        title: "Location Master",
        pageCode: "LOCATION",
        path: "/location",
        element: <LocationList />,
        showInSidebar: true,
        icon: <MapPin size={18} strokeWidth={2.5} />
    },
    {
        title: "Add Location",
        pageCode: "LOCATION",
        path: "/location/add",
        element: <LocationForm />,
        showInSidebar: false
    },
    {
        title: "Edit Location",
        pageCode: "LOCATION",
        path: "/location/edit/:id",
        element: <LocationForm />,
        showInSidebar: false
    }
];
