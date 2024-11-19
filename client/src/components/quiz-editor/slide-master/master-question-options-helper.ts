import { MCQMASlide, MCQSASlide } from "@/models/Quiz";

type OptionSlide = MCQMASlide | MCQSASlide;

export function addOption(slide: OptionSlide, onSlideUpdate: (slide: OptionSlide) => void) {
    if (!("options" in slide)) return;

    onSlideUpdate({
        ...slide,
        options: [
            ...slide.options,
            { id: crypto.randomUUID(), text: "", isCorrect: false },
        ],
    });
}

export function removeOption(
    slide: OptionSlide,
    optionId: string,
    onSlideUpdate: (slide: OptionSlide) => void
) {
    if (!("options" in slide)) return;

    onSlideUpdate({
        ...slide,
        options: slide.options.filter((opt) => opt.id !== optionId),
    });
}

export function updateOption(
    slide: OptionSlide,
    optionId: string,
    updates: Partial<{ text: string; isCorrect: boolean }>,
    onSlideUpdate: (slide: OptionSlide) => void
) {
    if (!("options" in slide)) return;

    onSlideUpdate({
        ...slide,
        options: slide.options.map((opt) =>
            opt.id === optionId
                ? { ...opt, ...updates }
                : slide.questionType === "MCQSA" &&
                  "isCorrect" in updates &&
                  updates.isCorrect
                ? { ...opt, isCorrect: false }
                : opt
        ),
    });
}
