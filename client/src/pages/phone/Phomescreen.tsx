import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Phomescreen() {
    return (
      <div className="h-screen flex flex-col">
        {/* Top section with the heading */}
        <header className="flex items-center justify-center py-4"> {/* Reduced padding here */}
          <h1 className="text-7xl font-bold font-display">GameShack</h1>
        </header>
  
        {/* Centered Input and Button section */}
        <div className="flex flex-col items-center justify-start mt-12 w-1/2 mx-auto space-y-8"> {/* Changed flex-grow to mt-12 */}
          <h2 className="text-4xl font-bold font-display">Enter a room!</h2>
          <Input
            type="email"
            placeholder="Enter code"
            className="text-center bg-[#FFFFFF] font-display text-3xl"
          />
          <Button className="bg-[#00FF9C] text-5xl text-black hover:bg-[#86D293] py-12 px-16 font-display">
            Join
          </Button>
        </div>
      </div>
    );
}

export default Phomescreen;
