import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { makeid } from "../User/Profile";

interface CreateParticipantProps {
  name: string;
  avatar: string;
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
  handleAddParticipant: () => void;
}

export default function CreateParticipant({
  name,
  avatar,
  setName,
  setAvatar,
  handleAddParticipant,
}: CreateParticipantProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !avatar) {
      setErrorMessage("Both name and avatar are required.");
      return;
    }

    handleAddParticipant();
  };

  function changeAvatarClick() {
    setAvatar(makeid(10));
  }

  return (
    <>
      {/* Input for name */}
      <Input
        placeholder="Enter Name"
        className="text-[#333333] text-center border-gray-400 rounded-md font-display text-3xl py-8 px-12 w-full shadow-lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* TODO: Maybe change so background is always same color */}

      <Avatar
        style={{ width: "8rem", height: "8rem" }}
        {...genConfig(avatar)}  
      />
      <Button onClick={changeAvatarClick} className="mx-5 bg-blue-500">
        Randomize
      </Button>

      {/* Join */}
      <Button
        onClick={handleSubmit}
        className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg"
      >
        Join
      </Button>

      {/* TODO: Better error, if any */}
      {errorMessage && (
        <div className="text-red-500 text-xl font-semibold mt-4">
          {errorMessage}
        </div>
      )}
    </>
  );
}
