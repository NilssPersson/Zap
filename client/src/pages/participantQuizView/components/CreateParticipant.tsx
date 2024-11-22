import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { userService } from "@/services/users";

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
    chars.charAt(Math.random() * chars.length)
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
  const [ifUserLoggedIn, setIfUserLoggedIn] = useState(false);
  const { user } = useGetAuthenticatedUser();
  const [avatarString, setAvatarString] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function initializeUser() {
      if (!user || !user.id || !user.email) {
        return;
      }

      try {
        // Call findOrCreate to fetch or create the user
        const { data, error } = await userService.findOrCreate(
          user.id,
          user.email
        );

        if (error) {
          console.error("Error in findOrCreate:", error);
          return;
        }

        if (data) {
          setUsername(data.username || ""); // Set username
          setAvatarString(data.avatar || ""); // Set avatar string
          setIfUserLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
      }
    }

    initializeUser();
  }, [user]);
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
      {ifUserLoggedIn && (
        <Tabs defaultValue="me">
          <div className="bg-component-background rounded-lg flex flex-col items-center justify-center  p-6 w-full">
            {ifUserLoggedIn && (
              <div className="flex flex-col items-center justify-center w-full max-w-md  ">
                <TabsList className="flex-1 space-x-10 w-full grid-cols-2 p-6 rounded-lg">
                  <TabsTrigger
                    className=" rounded-lg font-display md:text-2xl text-2xl p-4 "
                    value="me"
                  >
                    Play as {username}
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded-lg font-display md:text-2xl text-2xl p-4"
                    value="guest"
                  >
                    Play as Guest
                  </TabsTrigger>
                </TabsList>
              </div>
            )}
            <TabsContent
              value="me"
              className="flex flex-col items-center justify-center space-y-4"
            >
              <Avatar
                style={{ width: "8rem", height: "8rem" }}
                {...genConfig(avatarString)}
              />

              <Input
                disabled={true}
                className={`text-[#333333] text-center font-display md:text-3xl text-3xl py-8 px-12 w-full shadow-lg ${
                  showError && "border-red-500 animate-shake"
                }`}
                value={username}
                onChange={handleNameChange}
              />
              {/* Join */}
              <Button
                onClick={handleSubmit}
                className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg"
              >
                Play
              </Button>
            </TabsContent>
            <TabsContent
              value="guest"
              className="flex flex-col items-center justify-center space-y-4"
            >
              <Avatar
                style={{ width: "8rem", height: "8rem" }}
                {...genConfig(avatar)}
              />
              <Button onClick={changeAvatarClick} className="mx-5 bg-blue-400">
                Randomize
              </Button>
              <Input
                placeholder="Enter Guest Name"
                className={`text-[#333333] text-center font-display md:text-3xl text-3xl py-8 px-12 w-full shadow-lg ${
                  showError && "border-red-500 animate-shake"
                }`}
                value={name}
                onChange={handleNameChange}
              />
              {/* Join */}
              <Button
                onClick={handleSubmit}
                className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg"
              >
                Play
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      )}
      {!ifUserLoggedIn && (
        <div className=" bg-component-background rounded-lg flex flex-col items-center justify-center gap-4 p-6 ">
          <Avatar
            style={{ width: "8rem", height: "8rem" }}
            {...genConfig(avatar)}
          />
          <Button onClick={changeAvatarClick} className="mx-5 bg-blue-400">
            Randomize
          </Button>
          <Input
            placeholder="Enter Guest Name"
            className={`text-[#333333] text-center font-display md:text-3xl text-3xl py-8 px-12 w-full shadow-lg ${
              showError && "border-red-500 animate-shake"
            }`}
            value={name}
            onChange={handleNameChange}
          />
          {/* Join */}
          <Button
            onClick={handleSubmit}
            className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg"
          >
            Play
          </Button>
        </div>
      )}
    </div>
  );
}
