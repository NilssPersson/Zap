export * from './Option';
export * from './Preview';
export * from './Participant';
export * from './Toolbar';
export * from './Render';

import { InfoIcon } from "lucide-react";
export const Info = {
    value: "info",
    icon: InfoIcon,
    label: "Information Slide",
} as const;