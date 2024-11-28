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



//   var participantsDev = [
//     {
//       name: "Alice Johnson",
//       participantId: "P001",
//       avatar: "EROHNv5Xbi",
//       hasAnswered: true,
//       score: [0],
//       answers: [
//         {
//           slideNumber: 1,
//           answer: [""],
//           time: "2024-11-26T14:45:00Z",
//         },
//       ],
//     },
//     {
//       name: "Bob Smith",
//       participantId: "P002",
//       avatar: "1DlEEWtlZB",
//       hasAnswered: false,
//       score: [0],
//       answers: [
//         {
//           slideNumber: 1,
//           answer: [""],
//           time: "2024-11-26T14:28:00Z",
//         },
//       ],
//     },
//     {
//       name: "Charlie Brown",
//       participantId: "P003",
//       avatar: "orXBJkBsVO",
//       hasAnswered: true,
//       score: [0],
//       answers: [
//         {
//           slideNumber: 1,
//           answer: [""],
//           time: "2024-11-26T14:30:00Z",
//         },
//       ],
//     },
//     {
//       name: "Dana White",
//       participantId: "P004",
//       avatar: "EROHNv5Xbi",
//       hasAnswered: true,
//       score: [0],
//       answers: [
//         {
//           slideNumber: 1,
//           answer: [""],
//           time: "2024-11-26T14:33:00Z",
//         },
//       ],
//     },
//   ];