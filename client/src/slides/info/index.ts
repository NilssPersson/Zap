export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer'
export * from './Toolbar';
export * from './Render';

import { SlideTypes } from '@/models/Quiz';
import { InfoIcon } from "lucide-react";
import { SlideInfo } from "..";

export const Info: SlideInfo = {
    value: "info",
    icon: InfoIcon,
    label: "Information Slide",
    slideType: SlideTypes.info,
    defaults: {}
} as const;