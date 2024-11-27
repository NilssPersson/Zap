export * from "./Preview";
export * from "./ParticipantAnswer";
export * from "./Toolbar";
export * from "./Participant";
export * from "./Host";
export * from "./HostAnswer";

import { QuestionTypes, SlideTypes, AnswerTypes } from "@/models/Quiz";
import { Timer } from "lucide-react";
import { SlideInfo } from "../..";

export const Info: SlideInfo = {
  value: "question:FA",
  icon: Timer,
  label: "Fastest Answer Question",
  slideType: SlideTypes.question,
  questionType: QuestionTypes.FA,
  defaults: {
    answerType: AnswerTypes.speed,
  },
} as const;
