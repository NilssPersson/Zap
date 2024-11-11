import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  return (
    <>
      {/* Input for name */}
      <Input
        placeholder="Enter Name"
        className="text-[#333333] text-center border-gray-400 rounded-md font-display text-3xl py-8 px-12 w-full shadow-lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* TODO: Use some avatar generation library */}
      <Input
        disabled={true}
        placeholder="Enter Avatar URL"
        className="text-[#333333] text-center border-gray-400 rounded-md font-display text-3xl py-8 px-12 w-full shadow-lg"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
      />

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
