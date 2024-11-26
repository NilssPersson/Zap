import { QuestionType, Slide, SlideType } from "@/models/Quiz";
import { LucideIcon } from "lucide-react";
import * as Info from "./info";
import * as Score from "./score";
import * as Lobby from "./lobby";
import * as MCQSA from "./question/mcqsa";
import * as MCQMA from "./question/mcqma";
import * as FA from "./question/fa";
import * as Rank from "./question/rank";

interface ToolbarProps {
  slide: Slide;
  onSlideUpdate: (slide: Slide) => void;
}

interface SlideInfo {
  value: string;
  icon: LucideIcon;
  label: string;
  slideType: SlideType;
  questionType?: QuestionType;
  defaults: Partial<Slide>;
  uneditable?: boolean;
}

export type { ToolbarProps, SlideInfo };

export { Info, Score, Lobby, MCQSA, MCQMA, FA, Rank };
