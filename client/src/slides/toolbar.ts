import { Slide, InfoSlide, MCQMASlide, MCQSASlide, RankSlide, QuestionSlide } from "@/models/Quiz";
import ImageInput from "./_toolbar/inputs/ImageInput";
import BackgroundInput from "./_toolbar/inputs/BackgroundInput";
import EmbedVideoInput from "./_toolbar/inputs/EmbedVideoInput";
import { MCQOptionsInput } from "./_toolbar/inputs/MCQOptionsInput";
import { RankOptionsInput } from "./_toolbar/inputs/RankOptionsInput";
import { QuestionSettingsInput } from "./_toolbar/inputs/QuestionSettingsInput";
import TitleInput from "./_toolbar/inputs/TitleInput";
import ContentInput from "./_toolbar/inputs/ContentInput";

export interface ToolbarProps<T extends Slide> {
  slide: T;
  onSlideUpdate: (slide: T) => void;
}

type BaseToolbarItem<T extends Slide> = {
  label: string;
  component: React.ComponentType<ToolbarProps<T>>;
};

type ToolbarConfig<T extends Slide = Slide> = (BaseToolbarItem<T> & {
  field: keyof T;
})[];

const baseToolbarConfig: ToolbarConfig = [
  {
    field: "title",
    label: "Title",
    component: TitleInput,
  },
  {
    field: "content",
    label: "Content",
    component: ContentInput,
  },
  {
    field: "imageUrl",
    label: "Image",
    component: ImageInput,
  },
  {
    field: "backgroundStyle",
    label: "Background",
    component: BackgroundInput,
  },
];

export const toolbarConfigs = {
  info: [
    ...baseToolbarConfig,
    {
      field: "video" as keyof InfoSlide,
      label: "Video",
      component: EmbedVideoInput,
    },
  ],

  score: [
    ...baseToolbarConfig,
  ],

  lobby: [],

  MCQMA: [
    ...baseToolbarConfig,
    {
      field: "options" as keyof MCQMASlide,
      label: "Options",
      component: MCQOptionsInput,
    },
    {
      field: "showCorrectAnswer" as keyof QuestionSlide,
      label: "Question Settings",
      component: QuestionSettingsInput,
    },
  ],

  MCQSA: [
    ...baseToolbarConfig,
    {
      field: "options" as keyof MCQSASlide,
      label: "Options",
      component: MCQOptionsInput,
    },
    {
      field: "showCorrectAnswer" as keyof QuestionSlide,
      label: "Question Settings",
      component: QuestionSettingsInput,
    },
  ],

  RANK: [
    ...baseToolbarConfig,
    {
      field: "ranking" as keyof RankSlide,
      label: "Ranking",
      component: RankOptionsInput,
    },
    {
      field: "showCorrectAnswer" as keyof QuestionSlide,
      label: "Question Settings",
      component: QuestionSettingsInput,
    },
  ],

  FTA: [
    ...baseToolbarConfig,
    {
      field: "showCorrectAnswer" as keyof QuestionSlide,
      label: "Question Settings",
      component: QuestionSettingsInput,
    },
  ],
} as const; 