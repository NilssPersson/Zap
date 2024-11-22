import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { userService } from "@/services/users";
import { InfoIcon } from "lucide-react";

interface CreateParticipantProps {
  name: string;
  avatar: string;
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
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
  name,
  avatar,
  setName,
  setAvatar,
  handleAddParticipant,
}: CreateParticipantProps) {
  const [showError, setShowError] = useState(false);
  const [ifUserLoggedIn, setIfUserLoggedIn] = useState(false);
  const { user } = useGetAuthenticatedUser();
  const [guestAvatar, setGuestAvatar] = useState (createRandomId())
  const [guestName, setGuestName] = useState("")


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
          setName(data.username || "")
          setAvatar(data.avatar || createRandomId())
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
      }
    }

    initializeUser();
  }, [user,setName, setAvatar]);


  const handleSubmit = () => {
    
    if (!name) {
      console.log("if no name")
      setShowError(true);
      return;
    }

    handleAddParticipant(name,avatar);
  };

  const handleGuestSubmit = () => {
    if (!name) {
      
      setShowError(true);
      return;
    }

    handleAddParticipant(guestName, guestAvatar);
  };

  function changeAvatarClick() {
    const randomString = createRandomId();
    setAvatar(randomString);
    
  }

  function changeTempAvatarClick() {
    const randomString = createRandomId();
    setGuestAvatar(randomString)
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
          <div className="bg-component-background rounded-lg flex flex-col items-center justify-center  p-6 w-full">
            {ifUserLoggedIn && (
              <div className="flex flex-col items-center justify-center w-full max-w-md  ">
                <TabsList className="flex-1 space-x-10 w-full grid-cols-2 p-6 rounded-lg">
                  <TabsTrigger
                    className=" rounded-lg font-display md:text-2xl text-2xl p-4 "
                    value="me"
                  >
                    Play as {name}
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
                {...genConfig(avatar)}
              />

              <Input
                disabled={true}
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
            <TabsContent
              value="guest"
              className="flex flex-col items-center justify-center space-y-4"
            >
              <Avatar
                style={{ width: "8rem", height: "8rem" }}
                {...genConfig(guestAvatar)}
              />
              <Button onClick={changeTempAvatarClick} className="mx-5 bg-blue-400">
                Randomize
              </Button>
              <Input
                placeholder="Enter Guest Name"
                className={`text-[#333333] text-center font-display md:text-3xl text-3xl py-8 px-12 w-full shadow-lg ${
                  showError && "border-red-500 animate-shake"
                }`}
                value={guestName}
                onChange={handleGuestNameChange}
              />
              {/* Join */}
              {showError && (
                <div className="flex justify-start items-center w-full text-red-500">
                  <InfoIcon className="w-5 h-5 mr-1 animate-shake" />
                  <p className="font-display">Please enter a name</p>
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
