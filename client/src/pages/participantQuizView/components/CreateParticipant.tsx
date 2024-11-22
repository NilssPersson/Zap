import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { userService } from "@/services/users";
import { InfoIcon } from "lucide-react";

interface CreateParticipantProps {
  handleAddParticipant: (name: string, avatar: string) => void;
}

function createRandomId() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 10 }, () =>
    chars.charAt(Math.random() * chars.length)
  ).join("");
}

export default function CreateParticipant({
  handleAddParticipant,
}: CreateParticipantProps) {
  const [showError, setShowError] = useState(false);
  const [ifUserLoggedIn, setIfUserLoggedIn] = useState(false);
  const { user } = useGetAuthenticatedUser();
  const [guestAvatar, setGuestAvatar] = useState(createRandomId());
  const [guestName, setGuestName] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

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
          setIfUserLoggedIn(true);
          setName(data.username || "");
          setAvatar(data.avatar || createRandomId());
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
      }
    }

    initializeUser();
  }, [user]);

  const handleSubmit = () => {
    if (!name) {
      console.log("if no name");
      setShowError(true);
      return;
    }

    handleAddParticipant(name, avatar);
  };

  const handleGuestSubmit = () => {
    if (!guestName) {
      setShowError(true);
      return;
    }

    handleAddParticipant(guestName, guestAvatar);
  };

  function changeAvatarClick() {
    const randomString = createRandomId();
    setAvatar(randomString);
  }

  function changeGuestAvatarClick() {
    const randomString = createRandomId();
    setGuestAvatar(randomString);
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    setShowError(false);
  }
  function handleGuestNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGuestName(e.target.value);
    setShowError(false);
  }

  return (
    <div className="flex-1 w-full flex items-center justify-center overflow-hidden p-8">
      {ifUserLoggedIn && (
        <Tabs defaultValue="me">
          <div className="bg-component-background  w-3/4 mx-auto rounded-lg flex flex-col items-center justify-center  p-6 ">
            {ifUserLoggedIn && (
              <div className="flex flex-col items-center justify-center w-full max-w-md  ">
                <TabsList className="flex-1  w-full grid-cols-2 p-8 rounded-lg">
                  <TabsTrigger
                    className=" rounded-lg font-display md:text-lg text-lg  "
                    value="me"
                  >
                    Play as {name}
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded-lg font-display md:text-lg text-lg "
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
                style={{ width: "6rem", height: "6rem" }}
                {...genConfig(avatar)}
              />

              <Input
                disabled={true}
                className={`text-[#333333] text-center font-display md:text-lg text-lg py-8 px-12 w-full shadow-lg ${
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
            <TabsContent
              value="guest"
              className="flex flex-col items-center justify-center space-y-4"
            >
              <Avatar
                style={{ width: "6rem", height: "6rem" }}
                {...genConfig(guestAvatar)}
              />
              <Button
                onClick={changeGuestAvatarClick}
                className="mx-5 bg-blue-400"
              >
                Randomize
              </Button>
              <Input
                placeholder="Enter Guest Name"
                className={`text-[#333333] text-center font-display md:text-lg text-lg py-8 px-12 w-full shadow-lg ${
                  showError && "border-red-500 animate-shake"
                }`}
                value={guestName}
                onChange={handleGuestNameChange}
                maxLength={15}
              />
              {/* Join */}
              {showError && (
                <div className="flex justify-start items-center w-full text-red-500">
                  <InfoIcon className="w-5 h-5 mr-1 animate-shake" />
                  <p className="font-display">Please enter a guest name</p>
                </div>
              )}
              <Button
                onClick={handleGuestSubmit}
                className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg"
              >
                Play
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      )}
      {!ifUserLoggedIn && (
       
        <div className="md:w-4/12 bg-component-background w-5/6 mx-auto rounded-lg flex flex-col items-center justify-center space-y-4 p-6 shadow-lg">
          <Avatar
            style={{ width: "4rem", height: "4rem" }}
            {...genConfig(avatar)}
          />
          <Button onClick={changeAvatarClick} className="mx-5 bg-blue-400">
            Randomize
          </Button>
          <Input
            placeholder="Guest Name"
            className={`text-[#333333] text-center font-display md:text-lg text-md shadow-lg w-1/2 ${
              showError && "border-red-500 animate-shake"
            }`}
            value={guestName}
            maxLength={15}
            onChange={handleGuestNameChange}
          />
          {showError && (
            <div className="flex justify-start items-center  text-red-500">
              <InfoIcon className="w-5 h-5 mr-1 animate-shake" />
              <p className="font-display">Please enter a guest name</p>
            </div>
          )}
          <Button
            onClick={handleGuestSubmit}
            className="bg-[#333333] text-lg text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-1/2 shadow-lg"
          >
            Play
          </Button>
        </div>
       
      )}
    </div>
  );
}
