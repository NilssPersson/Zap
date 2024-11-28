import { FTASlide, Participant } from "@/models/Quiz";
import { BaseQuestionRender } from "@/slides/question/base/QuestionRender";

export function Preview({
  slide,
  participants,
}: {
  slide: FTASlide;
  participants: Participant[];
}) {
  return <BaseQuestionRender participants={participants} slide={slide} />;
}
