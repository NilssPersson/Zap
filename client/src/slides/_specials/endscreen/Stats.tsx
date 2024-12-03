import { Participant } from "@/models/Quiz";

export default function Stats({
  participants,
}: {
  participants: Participant[];
}) {
  console.log(participants);
  return <div>Stats</div>;
}
