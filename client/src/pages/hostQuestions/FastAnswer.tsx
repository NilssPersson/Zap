import { useState, useEffect} from "react";
import { Button } from "@/components/ui/button";

type FastAnswerProps = {
  numberOfClicks: number;
  countDownAnswer: number;
  question: string;
  players: string[]; // List of players to track turns
};

const FastAnswer: React.FC<FastAnswerProps> = ({
  numberOfClicks,
  countDownAnswer,
  question,
  players,
}) => {
  const [timeLeft, setTimeLeft] = useState(countDownAnswer); // Track time remaining
  const [totalAnswers, setTotalAnswers] = useState(0); // Track number of answers
  const [isAnswering, setIsAnswering] = useState(false); // Track if answering
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Track if the timer is running
  const [currentPlayer, setCurrentPlayer] = useState(""); // Track if the timer is running
  const [queue, setQueue] = useState<string[]>([]); // Queue to store players who pressed 'X'
  const [answeredPlayers, setAnsweredPlayers] = useState<string[]>([]); // Set to track players who have answered



  // Memoize simulatePlayerPresses with useCallback
 

  // Start and stop the timer based on timeLeft and the condition of answers
  useEffect(() => {
    if (timeLeft <= 0 || totalAnswers >= numberOfClicks || !isTimerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Clear the interval once the timer is finished or paused
    return () => clearInterval(timer);
  }, [timeLeft, totalAnswers, numberOfClicks, isTimerRunning]); // Only depend on timeLeft, totalAnswers, and isTimerRunning

  // Function to handle player answers
  const playerHasAnswered = (player: string) => {
    console.log(player)
    if (answeredPlayers.includes(player)) {
        console.log(player + "has already answered") 
        return;
    }
    if (currentPlayer == ""){
        setIsAnswering(true)
        setIsTimerRunning(false)
        setCurrentPlayer(player)
        setAnsweredPlayers((prev) => [...prev, player]);
        setTotalAnswers((prev) => prev + 1); // Increase total answers
        return;
    }
    else if (currentPlayer != "" ){
        setAnsweredPlayers((prev) => [...prev, player]);
        setTotalAnswers((prev) => prev + 1); // Increase total answers
        setQueue((prev) => [...prev, player]);  // Adds the player to the queue
        return;
    }
  };

  // Function to remove a player from the queue
  const removePlayerFromQueue = (player: string) => {
    // Remove the player from the queue
    setQueue((prev) => prev.filter((p) => p !== player)); 
  
    // Check if there are remaining players in the queue
    if (queue.length > 0) {
      // Set the next player in the queue as the current player
      setCurrentPlayer(queue[0]);
      setQueue((prev) => prev.filter((p) => p !== queue[0])); 
    } else {
      // If no players are left, reset current player
      setCurrentPlayer('');
      setIsAnswering(false)
      setIsTimerRunning(true)
    }
  };


  return (
    <div className="flex-1 w-full flex items-center justify-center overflow-hidden p-8">
      <div className="flex-col items-center justify-center w-full space-y-8 flex">
        <h1 className=" justify-center bg-black  text-8xl font-bold font-display  items-center">
          {question}
        </h1>

        <h1 className="text-4xl  font-bold font-display flex items-center">
        <Button onClick={() => playerHasAnswered(players[0])} className=" mx-5 bg-red-500">Answer 1</Button>
        <Button onClick={() => playerHasAnswered(players[1])} className=" mx-5 bg-red-500">Answer 2</Button>
        <Button onClick={() => playerHasAnswered(players[2])} className=" mx-5 bg-red-500">Answer 3</Button>
        <Button onClick={() => playerHasAnswered(players[3])} className=" mx-5 bg-red-500">Answer 4</Button>

        <Button onClick={() => removePlayerFromQueue(currentPlayer)} className=" mx-5 bg-red-500">Remove</Button>
        </h1>

        <h1 className="text-4xl  font-bold font-display flex items-center">
          Time left: {timeLeft}
        </h1>

        <h1 className="text-6xl  font-bold font-display flex items-center">
          {totalAnswers} / {numberOfClicks}
        </h1>

        <div style={{ minHeight: "3rem" }} className="text-4xl text-500 mt-4">
          {isAnswering && (
            <div>{currentPlayer} is answering...</div>
          )}
        </div>

        


      
      </div>
    </div>
  );
};

export default FastAnswer;
