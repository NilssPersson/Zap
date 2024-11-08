import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Phomescreen() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      {/* Top section with the heading */}
      <header className="flex items-center justify-center py-4">
        <h1 className="font-bold font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          GameShack
        </h1>
      </header>

      {/* Centered Input and Button section */}
      <div className="bg-[#fefefe] rounded-2xl flex flex-col items-center justify-start mt-12 w-3/5 space-y-8 py-12 px-8">
        <Input
          placeholder="Code"
          className="text-center border-gray-300 rounded-md font-display text-3xl py-4 px-6 w-full shadow-lg"
        />
        
        <Button className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-4 px-6 font-display w-full shadow-lg">
          Join
        </Button>
      </div>
    </div>
  );
}

export default Phomescreen;
