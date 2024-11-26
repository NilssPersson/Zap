import { FASlide, Participant } from "@/models/Quiz";
import { BaseQuestionRender } from "@/slides/question/base/QuestionRender";

export function Preview({
  slide,
  participants,
}: {
  slide: FASlide;
  participants: Participant[];
}) {
  return <BaseQuestionRender participants={participants} slide={slide} />;
}
