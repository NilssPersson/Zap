import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateParticipant from "./CreateParticipant";
import { InfoIcon } from "lucide-react";
import { checkIfGameExists, addParticipant } from "@/services/client";
import { useNavigate } from "react-router-dom";

export default function StartScreen() {
  const [quizCode, setQuizCode] = useState("");
  const [showError, setShowError] = useState(false);
  const [name, setName] = useState("");
  const [view, setView] = useState("enterCode"); // enterCode, createParticipant
  const [avatar, setAvatar] = useState("test");

  const navigate = useNavigate();

  async function handleAddParticipant() {
    console.log("Participant Added:", { name, avatar });
    const participantId = await addParticipant(quizCode, name, avatar);
    navigate(`/${quizCode}/${participantId}`);
  }

  async function checkCode() {
    const quizExists = await checkIfGameExists(quizCode);
    if (quizExists) {
      // Logic for when the game exists
      // TODO: Check if there exist a "gameName" and avatar for the user, then just add the participant
      setView("createParticipant");
    } else {
      // Logic for when the game does not exist
      setShowError(true);
    }
  }

  // Check the code input, Should only be 4 Uppercase letters
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();

    if (/^[A-Z]{0,4}$/.test(value)) {
      setQuizCode(value);
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
        {view === "createParticipant" ? (
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
              value={quizCode}
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
