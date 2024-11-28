import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateQuizPopoverProps {
  onCreateQuiz: (name: string) => Promise<void>;
}

function CreateQuizPopover({ onCreateQuiz }: CreateQuizPopoverProps) {
  const [quizName, setQuizName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleCreate = async () => {
    if (!quizName.trim()) return;
    setQuizName("");
    setIsOpen(false);
    await onCreateQuiz(quizName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>
          <span className="flex items-center gap-2">
            {t("homepage:createQuiz")}
            <Plus />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <Input
            placeholder={t("homepage:quizName")}
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <Button onClick={handleCreate}>
            <span className="flex items-center gap-2">
              {t("homepage:create")} <Plus />
            </span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CreateQuizPopover;
