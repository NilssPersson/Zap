import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Phomescreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {/* Top section with the heading */}
      <header className="flex items-center justify-center py-4">
        <h1 className="text-8xl font-bold font-display">GameShack</h1>
      </header>

      {/* Centered Input and Button section */}
      <div className="bg-[#fefefe] border border-gray-300 rounded-2xl flex flex-col items-center justify-start mt-16 w-1/2 mx-auto space-y-8 py-12 px-8 shadow-lg">
        
        
        <Input
          type="email"
          placeholder="Enter code"
          className="text-center bg-white border border-gray-300 rounded-md font-display text-2xl py-4 px-6 w-full shadow-lg"
        />
        
        <Button className="bg-[#333333] text-2xl text-[#fefefe] hover:bg-[#86D293] py-4 px-6 font-display w-full shadow-lg">
          Join
        </Button>
      </div>
    </div>
  );
}

export default Phomescreen;
