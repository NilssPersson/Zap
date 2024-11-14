import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useOngoingQuiz } from "@/hooks/useOngoingQuizzes";
import CreateParticipant from "./CreateParticipant";

import { InfoIcon } from "lucide-react";
import { checkIfGameExists, addParticipant } from "@/services/client";

function StartScreen() {
  const [codeValue, setCodeValue] = useState("");
  const [showError, setShowError] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [name, setName] = useState("");
  //const [lobbyState, setLobbyState] = useState("enterCode"); // enterCode or createParticipant

  const [avatar, setAvatar] = useState("test");

  //const navigate = useNavigate();
  const { ongoingQuiz, isLoading, error } = useOngoingQuiz();

  console.log(isAddingParticipant);
  console.log(ongoingQuiz);

  async function handleAddParticipant() {
    console.log("Participant Added:", { name, avatar });
    const participantId = await addParticipant(codeValue, name, avatar);

    console.log("wooohio" + participantId);
    //navigate(`/${ongoingQuiz?.quiz_code}/${newParticipant.id}`);
  }

  async function QuizExists(quizCode: string) {
    const exists = await checkIfGameExists(quizCode);
    if (exists) {
      // Logic for when the game exists
    } else {
      // Logic for when the game does not exist
      setShowError(true);
    }
  }

  useEffect(() => {
    if (isSearchActive && codeValue) {
      QuizExists(codeValue);
    }
  }, [isSearchActive, codeValue]);

  // Hande when the search
  useEffect(() => {
    setIsSearchActive(false); // Reset the search state
    if (ongoingQuiz === undefined && !isLoading) {
      setShowError(true);
    } else if (
      ongoingQuiz !== undefined &&
      ongoingQuiz !== null &&
      !isLoading
    ) {
      setCodeValue("");
      setIsAddingParticipant(true);
    }
  }, [error, ongoingQuiz, isLoading]);

  const checkCode = () => {
    setIsSearchActive(true);
  };

  // Check the code input, Should only be 6 characters uppercase letters & numbers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();

    if (/^[A-Z]{0,4}$/.test(value)) {
      setCodeValue(value);
    }
    if (value.length === 0) {
      setShowError(false);
    }
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center overflow-hidden p-8">
      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center w-full max-w-md space-y-4 bg-[#fefefe] rounded-2xl p-8 shadow-lg">
        <header className="text-center">
          <h1 className="font-bold font-display text-[#333333] text-5xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl">
            GameShack
          </h1>
        </header>

        {ongoingQuiz !== null && ongoingQuiz !== undefined ? (
          <CreateParticipant
            name={name}
            avatar={avatar}
            setName={setName}
            setAvatar={setAvatar}
            handleAddParticipant={handleAddParticipant}
          />
        ) : (
          <>
            <Input
              placeholder="Code"
              className="text-[#333333] text-center border-gray-400 rounded-md font-display text-3xl py-8 px-12 w-full shadow-lg"
              value={codeValue}
              onChange={handleInputChange}
            />
            {showError && (
              <div className="flex justify-start items-center w-full text-red-500">
                <InfoIcon className="w-5 h-5 mr-1" />
                <p>Invalid Code</p>
              </div>
            )}
            <Button
              onClick={checkCode}
              className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg"
            >
              Join
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default StartScreen;
