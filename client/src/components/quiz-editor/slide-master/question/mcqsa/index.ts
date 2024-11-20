export * from './Option';
export * from './Preview';
export * from './Toolbar';

import { CircleDotIcon } from "lucide-react";
export const Info = {
    value: "question:MCQSA",
    icon: CircleDotIcon,
    label: "Single Answer MCQ",
} as const; 