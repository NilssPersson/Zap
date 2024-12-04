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
            <Results participants={participants} />
          </TabsContent>
          <TabsContent className="flex-1" value="statistics">
            <Stats participants={participants} />
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
