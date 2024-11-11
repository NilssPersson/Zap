import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState, useEffect } from "react";
import { useOngoingQuiz } from "@/hooks/useOngoingQuizzes";
import CreateParticipant from "./CreateParticipant";
import { useAddQuizParticipant } from "@/hooks/useParticipant";

function StartScreen() {
  const [codeValue, setCodeValue] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Missing");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("test");

  const { ongoingQuiz, isLoading, error, getOngoingQuiz } = useOngoingQuiz();
  const { participant, addParticipant } = useAddQuizParticipant();

  console.log(isAddingParticipant);
  console.log(ongoingQuiz);

  function handleAddParticipant() {
    console.log("Participant Added:", { name, avatar });
    addParticipant(ongoingQuiz!.quiz_code, name, avatar);
    console.log(participant);
  }

  useEffect(() => {
    if (isSearchActive && codeValue) {
      getOngoingQuiz(codeValue); // Fetch the quiz
    }
  }, [isSearchActive, codeValue, getOngoingQuiz]);

  // Hande when the search
  useEffect(() => {
    setIsSearchActive(false); // Reset the search state
    if (error) {
      setErrorMessage("Invalid");
      setDrawerOpen(true);
    } else if (ongoingQuiz === undefined && !isLoading) {
      setErrorMessage("Invalid");
      setDrawerOpen(true);
    } else if (ongoingQuiz !== undefined && !isLoading) {
      // Quiz found
      setErrorMessage("Quiz Found!");
      setDrawerOpen(true);
      setCodeValue("");
      setIsAddingParticipant(true);
    }
  }, [error, ongoingQuiz, isLoading]);

  const checkCode = () => {
    if (!codeValue) {
      setErrorMessage("Missing");
      setDrawerOpen(true);
    } else {
      setIsSearchActive(true);
    }
  };

  // Check the code input, Should only be 6 characters uppercase letters & numbers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();

    if (/^[A-Z0-9]{0,6}$/.test(value)) {
      setCodeValue(value);
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

        {ongoingQuiz !== null ? (
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

            <Button
              onClick={checkCode}
              className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg"
            >
              Join
            </Button>

            <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerContent>
                <div className="flex items-center justify-center">
                  <DrawerHeader>
                    <DrawerTitle className="text-3xl">
                      {errorMessage}
                    </DrawerTitle>
                    <DrawerDescription>
                      Please enter a valid code to proceed.
                    </DrawerDescription>
                  </DrawerHeader>
                </div>
                <div className="flex justify-center">
                  <DrawerFooter>
                    <Button
                      className="px-8 py-4 rounded-lg shadow-md text-xl bg-[#333333] text-[#fefefe]"
                      onClick={() => setDrawerOpen(false)}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </div>
    </div>
  );
}

export default StartScreen;
