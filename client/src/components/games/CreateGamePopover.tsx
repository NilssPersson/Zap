import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateGamePopoverProps {
    onCreateGame: (name: string) => Promise<void>;
}

function CreateGamePopover({ onCreateGame }: CreateGamePopoverProps) {
    const [gameName, setGameName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleCreate = async () => {
        if (!gameName.trim()) return;
        await onCreateGame(gameName);
        setGameName("");
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button>
                    <span className="flex items-center gap-2">
                        Create Game
                        <Plus />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Game name"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                    />
                    <Button onClick={handleCreate}>
                        <span className="flex items-center gap-2">
                            Create <Plus />
                        </span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default CreateGamePopover; 