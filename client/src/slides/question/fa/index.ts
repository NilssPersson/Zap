export * from "./Preview";
export * from "./ParticipantAnswer";
export * from "./Participant";
export * from "./Host";
export * from './HostAnswer';

import { QuestionTypes, SlideTypes, AnswerTypes } from "@/models/Quiz";
import { TypeIcon } from "lucide-react";
import { SlideInfo } from "../..";
export const Info: SlideInfo = {
  value: "question:FA",
  icon: TypeIcon,
  label: "Free Answer Question",
  slideType: SlideTypes.question,
  questionType: QuestionTypes.FA,
  defaults: {
    correctAnswer: "",
    answerType: AnswerTypes.freeText,
  },
} as const;
