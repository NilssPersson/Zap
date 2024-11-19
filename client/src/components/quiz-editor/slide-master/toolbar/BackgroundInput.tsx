import { BackgroundStyle } from "../../QuizBackground";

import { SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ToolbarProps } from "..";

export default function BackgroundInput({ slide, onSlideUpdate }: ToolbarProps) {
    const backgroundStyles: { value: BackgroundStyle; label: string }[] = [
        { value: "waves", label: "Waves" },
        { value: "blob", label: "Blob" },
        { value: "blobInverted", label: "Inverted Blob" },
        { value: "circle", label: "Circles" },
    ];

    return (
        <div className="space-y-2">
            <Label>Background Style</Label>
            <Select
                value={slide.backgroundStyle || "waves"}
                onValueChange={(value: BackgroundStyle) =>
                    onSlideUpdate({ ...slide, backgroundStyle: value })
                }
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {backgroundStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                            {style.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}