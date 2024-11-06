import { Button } from "@/components/ui/button";

function Phomescreen() {
    return (
        <div className="flex flex-col items-center h-screen py-6 space-y-12">
            <h1 className="text-7xl font-bold mb-8">GameShack</h1>
            <div className="flex flex-col space-y-24">
            <Button className="bg-[#FFF4B7] text-black hover:bg-yellow-200 py-8 px-12 text-xl padding: xl">Join Game</Button>
                <Button className="bg-[#FFFFFF] text-black hover:bg-yellow-200 py-8 px-12 text-xl">Create Game</Button>
                <Button className="bg-[#FFF4B7] text-black hover:bg-yellow-200 py-8 px-12 text-xl">My Games</Button>
            </div>
        </div>
    );
}

export default Phomescreen;
