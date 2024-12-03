import { GameShackTitle } from "@/components/GameShackTitle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quiz, Participant } from "@/models/Quiz";
import Results from "./Results";
import Stats from "./Stats";

interface EndScreenProps {
  quiz: Quiz;
  endQuiz: () => void;
  participants: Participant[];
}

const mockParticipants: Participant[] = [
  { name: "Player 1", score: [1000, 1000, 0, 0, 1000], avatar: "ABCDEFGH", answers: [], hasAnswered: true, participantId: "1" },
  { name: "Player 2", score: [0, 1000, 0, 0, 1000], avatar: "BCDEFGHI", answers: [], hasAnswered: true, participantId: "2" },
  { name: "Player 3", score: [0, 0, 1000, 0, 1000], avatar: "CDEFGHIJ", answers: [], hasAnswered: true, participantId: "3" },
  { name: "Player 4", score: [0, 0, 0, 1000, 1000], avatar: "DEFGHIJK", answers: [], hasAnswered: true, participantId: "4" },
  { name: "Player 5", score: [0, 0, 0, 0, 1000], avatar: "EFGHIJKL", answers: [], hasAnswered: true, participantId: "5" },
  { name: "Player 6", score: [0, 0, 0, 0, 0], avatar: "FGHIJKLM", answers: [], hasAnswered: true, participantId: "6" },
  { name: "Player 7", score: [0, 0, 0, 0, 0], avatar: "GHIJKLMN", answers: [], hasAnswered: true, participantId: "7" },
  { name: "Player 8", score: [1000, 1000, 1000, 1000, 0], avatar: "HIJKLMNO", answers: [], hasAnswered: true, participantId: "8" },
  { name: "Player 9", score: [0, 0, 0, 0, 0], avatar: "IJKLMNOP", answers: [], hasAnswered: true, participantId: "9" },
  { name: "Player 10", score: [0, 0, 0, 0, 0], avatar: "JKLMNOPQ", answers: [], hasAnswered: true, participantId: "10" },
];

export default function EndScreen({
  quiz,
  endQuiz,
  participants,
}: EndScreenProps) {
  return (
    <div className="flex-1 flex flex-col p-10 gap-2">
      <div className="flex items-center gap-4 justify-center text-5xl font-display">
        <span className="font-bold">Thank you for playing</span>
        <GameShackTitle icon={false} />
      </div>
      <div className="flex items-center gap-4 justify-center text-3xl font-display">
        <span className="text-gray-500 text-xl">You just played:</span>
        <span className="font-bold">{quiz.quiz_name}</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <Tabs className="flex-1 flex flex-col w-full" defaultValue="results">
          <TabsList className="font-display bg-transparent">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent className="flex-1 overflow-hidden" value="results">
            <Results participants={mockParticipants} />
          </TabsContent>
          <TabsContent className="flex-1" value="statistics">
            <Stats participants={mockParticipants} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-center mt-auto">
        <Button className="max-w-sm" onClick={endQuiz}>
          End Quiz
        </Button>
      </div>
    </div>
  );
}

