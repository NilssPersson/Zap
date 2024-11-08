import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Phomescreen() {

    
  
       
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Header above the form */}
      <header className="flex items-center justify-center py-4">
        <h1  className="text-7xl font-bold font-display mb-16 fancy-wrap">GameShack</h1>
      </header>

      {/* Centered Input and Button section */}
      <div className="bg-[#fefefe] rounded-2xl flex flex-col items-center justify-start w-3/5 space-y-8 py-12 px-8 shadow-lg ">
        <Input
          placeholder="Code"
          className="text-center border-gray-400 font-display rounded-md text-3xl py-4 px-6 w-full shadow-lg"
        />

        <Button className="bg-[#333333] text-3xl text-[#fefefe] font-display hover:bg-[#86D293] py-4 px-6 w-full shadow-lg">
          Join
        </Button>
      </div>
    </div>
  );
}

export default Phomescreen;
