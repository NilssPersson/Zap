import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateQuizPopoverProps {
    onCreateQuiz: (name: string) => Promise<void>;
}

function CreateQuizPopover({ onCreateQuiz }: CreateQuizPopoverProps) {
    const [quizName, setQuizName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleCreate = async () => {
        if (!quizName.trim()) return;
        await onCreateQuiz(quizName);
        setQuizName("");
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button>
                    <span className="flex items-center gap-2">
                        Create Quiz
                        <Plus />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Quiz name"
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
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

export default CreateQuizPopover; 