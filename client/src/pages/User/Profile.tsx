import Avatar, { genConfig } from "react-nice-avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { userService } from "@/services/users";
import { Check, CircleX } from "lucide-react";

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function Profile() {
  const { user, updateUser } = useGetAuthenticatedUser();
  const [avatarString, setAvatarString] = useState("");
  const [username, setUsername] = useState("");
  const [updateStatus, setUpdateStatus] = useState<"success" | "error" | null>(
    null
  ); // Track the update status
  const [statusMessage, setStatusMessage] = useState(""); // Store the status message

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
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
      }
    }

    initializeUser();
  }, [user]);

  const changeAvatarClick = () => {
    setAvatarString(makeid(10)); // Generate a new random avatar strin
    setUpdateStatus(null);
  };

  const handleUpdate = async () => {
    if (!user || !user.id) return;

    const updatedUser = {
      ...user,
      username,
      avatar: avatarString, // Update the avatar field
    };

    try {
      // Try to update the user profile
      await updateUser(updatedUser);
      setUpdateStatus("success"); // If successful
      setStatusMessage("Profile updated!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setUpdateStatus("error"); // If there's an error
      setStatusMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex-1 w-full flex-col flex items-center justify-center overflow-hidden">
      <h1 className="font-display text-6xl mb-5">Profile</h1>
      <Card className="mx-5">
        <CardContent className="flex flex-col items-center gap-4 py-6">
          <Input
            placeholder="Username"
            className="text-[#333333] text-center border-gray-400 rounded-md font-display text-4xl md:text-4xl py-8 px-12 w-full shadow-lg"
            value={username}
            maxLength={15}
            onChange={(e) => {
              setUsername(e.target.value);
              setUpdateStatus(null); // Reset the update status whenever the username changes
            }}
          />
          <Avatar
            style={{ width: "8rem", height: "8rem" }}
            {...genConfig(avatarString)}
          />
          <div>
            <Button onClick={changeAvatarClick} className="mx-5 bg-blue-500">
              Randomize
            </Button>
            <Button onClick={handleUpdate} className="mx-5 bg-green-500">
              Update
            </Button>
          </div>

          {/* Display the status message and icon */}
          {updateStatus && (
            <div className="mt-4 flex flex-col items-center justify-center h-full">
              {" "}
              {/* Added h-full to fill the height */}
              {updateStatus === "success" ? (
                <div className="flex flex-col items-center justify-center">
                  {" "}
                  {/* flex-col ensures vertical stacking */}
                  <Check className="mr-4 text-green-500 size-20" />{" "}
                  {/* Icon with margin */}
                  <p className="font-display mt-2 text-2xl">{statusMessage}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {" "}
                  {/* flex-col ensures vertical stacking */}
                  <CircleX className="text-red-500 size-20" />{" "}
                  {/* Icon with margin */}
                  <p className="font-display mt-2 text-lg">{statusMessage}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
