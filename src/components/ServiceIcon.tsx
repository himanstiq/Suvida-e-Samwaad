import React from 'react';
import {
    Zap,
    Droplet,
    Flame,
    Trash2,
    HeartPulse,
    FileText,
} from 'lucide-react';

interface ServiceIconProps {
    serviceId: string;
    size?: number | string;
}

/**
 * Maps a service ID to its corresponding Lucide icon.
 * DRYs up the repeated icon-switch pattern across Dashboard, ServiceDetail, and WasteManagement pages.
 */
export const ServiceIcon = ({ serviceId, size = 32 }: ServiceIconProps) => {
    switch (serviceId) {
        case 'electricity': return <Zap size={size} />;
        case 'water': return <Droplet size={size} />;
        case 'gas': return <Flame size={size} />;
        case 'waste': return <Trash2 size={size} />;
        case 'health': return <HeartPulse size={size} />;
        case 'certificates': return <FileText size={size} />;
        default: return <FileText size={size} />;
    }
};
