import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Phomescreen() {
  return (
    <div className="flex-1 w-full flex items-center justify-center overflow-hidden p-8">
      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center w-full max-w-md space-y-8 bg-[#fefefe] rounded-2xl p-8 shadow-lg">
        <header className="text-center">
          <h1 className="font-bold font-display text-[#333333] text-5xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl">
            GameShack
          </h1>
        </header>

        {/* Input and Button section */}
        <Input
          placeholder="Code"
          className="text-black text-center border-gray-300 rounded-md font-display text-3xl py-8 px-12 w-full shadow-lg"
        />

        <Button className="bg-[#333333] text-3xl text-[#fefefe] hover:bg-[#86D293] py-8 px-12 font-display w-full shadow-lg">
          Join
        </Button>
      </div>
    </div>
  );
}

export default Phomescreen;
