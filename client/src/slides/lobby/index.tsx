export * from "./Preview";
export * from "./Render";
export * from "./Host";
export * from "./HostAnswer"

import { SlideTypes } from "@/models/Quiz";
import { Star } from "lucide-react";
import { SlideInfo } from "..";

export const Info: SlideInfo = {
  value: "lobby",
  icon: Star,
  label: "Lobby Slide",
  slideType: SlideTypes.lobby,
  defaults: {},
} as const;
