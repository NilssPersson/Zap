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
import { useState } from "react";

function StartScreen() {
  const [codeValue, setCodeValue] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Missing")
 

  const checkCode = () => {
    if (!codeValue) {
      console.log("Code missing");
      setErrorMessage("Missing")
      setDrawerOpen(true); // Open drawer if codeValue is missing
    } else if (codeValue === "invalid") {
      console.log("Add logic to check if code is valid")
      setErrorMessage("Invalid")
      setDrawerOpen(true)
      }
      else
      console.log("Code exists: --> Add Join game logic", codeValue); // Handle existing code case
    
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center overflow-hidden p-8">
      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center w-full max-w-md space-y-8 bg-[#fefefe] rounded-2xl p-8 shadow-lg">
        <header className="text-center">
          <h1 className="font-bold font-display text-[#333333] text-5xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl">
            GameShack
          </h1>
        </header>

        <Input
          placeholder="Code"
          className="text-[#333333] text-center border-gray-400 rounded-md font-display text-3xl py-8 px-12 w-full shadow-lg"
          value={codeValue}
          onChange={(e) => setCodeValue(e.target.value)}
        />

        <Button
          onClick={checkCode}
          className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg"
        >
          Join
        </Button>

        
        <Drawer  open={isDrawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{errorMessage} Code</DrawerTitle>
              
              <DrawerDescription>
                Please enter a valid code to proceed.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button className="bg-[#333333] text-[#fefefe]"  onClick={() => setDrawerOpen(false)} variant="outline">
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export default StartScreen;
