export * from './Option';
export * from './Preview';
export * from './Toolbar';

import { CheckSquareIcon } from "lucide-react";
export const Info = {
    value: "question:MCQMA",
    icon: CheckSquareIcon,
    label: "Multiple Answer MCQ",
} as const; 