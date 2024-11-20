import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { InfoIcon } from "lucide-react";

interface CreateParticipantProps {
  name: string;
  avatar: string;
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
  handleAddParticipant: () => void;
}

function createRandomId() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 10 }, () =>
    chars.charAt(Math.random() * chars.length),
  ).join("");
}

export default function CreateParticipant({
  name,
  avatar,
  setName,
  setAvatar,
  handleAddParticipant,
}: CreateParticipantProps) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setAvatar(createRandomId());
  }, [setAvatar]);

  const handleSubmit = () => {
    if (!name) {
      setShowError(true);
      return;
    }

    handleAddParticipant();
  };

  function changeAvatarClick() {
    const randomString = createRandomId();
    setAvatar(randomString);
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    setShowError(false);
  }

  return (
    <div className="flex-1 w-full flex items-center justify-center overflow-hidden p-8">
      <div className="flex flex-col items-center justify-center w-full max-w-md space-y-4 bg-[#fefefe] rounded-2xl p-8 shadow-lg">
        <Avatar
          style={{ width: "8rem", height: "8rem" }}
          {...genConfig(avatar)}
        />
        <Button onClick={changeAvatarClick} className="mx-5 bg-blue-400">
          Randomize
        </Button>
        <Input
          placeholder="Enter Name"
          className={`text-[#333333] text-center font-display text-3xl py-8 px-12 w-full shadow-lg ${
            showError && "border-red-500 animate-shake"
          }`}
          value={name}
          onChange={handleNameChange}
        />
        {showError && (
          <div className="flex justify-start items-center w-full text-red-500">
            <InfoIcon className="w-5 h-5 mr-1" />
            <p className="font-display">Name is required</p>
          </div>
        )}

        {/* Join */}
        <Button
          onClick={handleSubmit}
          className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg"
        >
          Play
        </Button>
      </div>
    </div>
  );
}
