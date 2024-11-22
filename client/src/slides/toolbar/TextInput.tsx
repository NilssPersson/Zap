import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolbarProps } from "..";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps extends ToolbarProps {
    label: string;
    slideKey: "title" | "content";
    placeholder: string;
    textArea?: boolean;
}

export default function TextInput({ slide, onSlideUpdate, label, slideKey, placeholder, textArea = false }: TextInputProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label>{label}</Label>
            </div>
            {textArea ? (
                <Textarea
                    value={slide[slideKey] || ""}
                    onChange={(e) => onSlideUpdate({ ...slide, [slideKey]: e.target.value })}
                    placeholder={placeholder}
                    className="min-h-[100px] text-black"
                />
            ) : (
                <Input
                    value={slide[slideKey] || ""}
                    onChange={(e) => onSlideUpdate({ ...slide, [slideKey]: e.target.value })}
                    className="text-xl font-bold"
                    placeholder={placeholder}
                />
            )}
        </div>
    )
}