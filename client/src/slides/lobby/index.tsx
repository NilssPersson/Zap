export * from "./Preview";
export * from "./Render";
export * from "./Host";
export * from "./HostAnswer";
export * from "./Participant";
export * from "./ParticipantAnswer";

import { SlideTypes } from "@/models/Quiz";
import { Star } from "lucide-react";
import { SlideInfo } from "..";

export const Info: SlideInfo = {
  value: "lobby",
  icon: Star,
  label: "Lobby Slide",
  slideType: SlideTypes.lobby,
  uneditable: true,
  defaults: {},
} as const;
