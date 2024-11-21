export * from './Preview';
export * from './Toolbar';

import { SlideTypes } from '@/models/Quiz';
import { BarChart3Icon } from "lucide-react";
import { SlideInfo } from '..';

export const Info: SlideInfo = {
    value: "score",
    icon: BarChart3Icon,
    label: "Score Slide",
    slideType: SlideTypes.score,
} as const;