import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Participant({
  answerQuestion,
}: {
  answerQuestion: (answer: string[]) => void;
}) {
  const [value] = useState("");
  const { t } = useTranslation(["questions"]);

  return (
    <div className="flex flex-col items-center justify-center mt-60 p-8 gap-28 ">
      <Button
        className="w-80 h-80 rounded-full text-4xl bg-red-600 text-white"
        onClick={() => answerQuestion([value])}
      >
        {t("answer")}
      </Button>
    </div>
  );
}
