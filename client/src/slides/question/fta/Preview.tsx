import { FTASLide, Participant } from "@/models/Quiz";
import { BaseQuestionRender } from "@/slides/question/base/QuestionRender";

export function Preview({
  slide,
  participants,
}: {
  slide: FTASLide;
  participants: Participant[];
}) {
  return <BaseQuestionRender participants={participants} slide={slide} />;
}
