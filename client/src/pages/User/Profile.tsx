import Avatar, { genConfig } from "react-nice-avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function Profile() {
  const [avatarString, setAvatarString] = useState("");
  const [username, setUsername] = useState("");

  function changeAvatarClick() {
    setAvatarString(makeid(10));
  }

   // Fetch data from the database on component mount
   useEffect(() => {
    async function loadUserData() {
      try {
        const data = await fetchUserData();
        setUsername(data.username);
        setAvatarString(data.avatarString);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    }
    
    loadUserData();
  }, []);

  async function fetchUserData() {
    // Replace this with actual API or database call logic
    return {
      username: "JohnDoe", // Example username from database
      avatarString: "1234567890", // Example avatar string from database
    };
  }

  function joinRoom(username: string, avatarString: string) {
    console.log(username, avatarString);
  }

  return (
    <div className="flex-1 w-full flex-col flex items-center justify-center overflow-hidden">

      <h1 className=" font-display text-6xl mb-5 ">Profile</h1>
      <Card className="mx-5">
        <CardContent className="flex flex-col items-center gap-4 py-6">
          <Input
            placeholder={username}
            className="text-[#333333] text-center border-gray-400 rounded-md font-display text-4xl py-8 px-12 w-full shadow-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Avatar
            style={{ width: "8rem", height: "8rem" }}
            {...genConfig(avatarString)}
          />
          <div>
            <Button onClick={changeAvatarClick} className="mx-5 bg-blue-500">
              Randomize
            </Button>
            <Button
              onClick={() => joinRoom(username, avatarString)}
              className="mx-5 bg-green-500"
            >
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
