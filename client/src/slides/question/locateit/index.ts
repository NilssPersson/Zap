export * from "./Preview";
export * from "./ParticipantAnswer";
export * from "./Participant";
export * from "./Host";
export * from './HostAnswer';

import { QuestionTypes, SlideTypes, AnswerTypes } from "@/models/Quiz";
import { MapPinnedIcon } from "lucide-react";
import { SlideInfo } from "../..";
export const Info: SlideInfo = {
  value: "question:LOCATEIT",
  icon: MapPinnedIcon,
  label: "Location Question",
  slideType: SlideTypes.question,
  questionType: QuestionTypes.LOCATEIT,
  interactivePreview: true,
  defaults: {
    location: {
      lat: 50.07,
      lng: 19.95,
    },
    answerType: AnswerTypes.location,
    points:1000,
  },
} as const;
