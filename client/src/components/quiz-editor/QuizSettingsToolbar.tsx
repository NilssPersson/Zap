import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface QuizSettingsToolbarProps {
    quizName: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    onUpdate: (updates: { 
        quizName?: string; 
        primaryColor?: string; 
        secondaryColor?: string;
        backgroundColor?: string;
    }) => void;
}

export function QuizSettingsToolbar({ 
    quizName, 
    backgroundColor = "#000B58",
    primaryColor = "#006a67",
    secondaryColor = "#fff4b7",
    onUpdate 
}: QuizSettingsToolbarProps) {
    const [localPrimary, setLocalPrimary] = useState(primaryColor);
    const [localSecondary, setLocalSecondary] = useState(secondaryColor);
    const [localBackground, setLocalBackground] = useState(backgroundColor);

    // Validate and update colors when hex input changes
    useEffect(() => {
        const hexRegex = /^#[0-9A-F]{6}$/i;
        if (hexRegex.test(localPrimary) && localPrimary !== primaryColor) {
            onUpdate({ primaryColor: localPrimary });
        }
    }, [localPrimary, primaryColor, onUpdate]);

    useEffect(() => {
        const hexRegex = /^#[0-9A-F]{6}$/i;
        if (hexRegex.test(localSecondary) && localSecondary !== secondaryColor) {
            onUpdate({ secondaryColor: localSecondary });
        }
    }, [localSecondary, secondaryColor, onUpdate]);

    useEffect(() => {
        const hexRegex = /^#[0-9A-F]{6}$/i;
        if (hexRegex.test(localBackground) && localBackground !== backgroundColor) {
            onUpdate({ backgroundColor: localBackground });
        }
    }, [localBackground, backgroundColor, onUpdate]);

    return (
        <div className="h-full bg-secondary/90 p-4 flex flex-col gap-4 overflow-y-auto text-black">
            <div className="space-y-2">
                <Label>Quiz Name</Label>
                <Input
                    value={quizName}
                    onChange={(e) => onUpdate({ quizName: e.target.value })}
                    className="text-xl font-bold"
                    placeholder="Quiz Name"
                />
            </div>

            <div className="space-y-4">
                <Label>Color Scheme</Label>
                
                <div className="space-y-2">
                    <Label className="text-sm">Background Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={localBackground}
                            onChange={(e) => setLocalBackground(e.target.value)}
                            className="w-12 h-12 p-1 cursor-pointer aspect-square"
                        />
                        <Input
                            value={localBackground}
                            onChange={(e) => setLocalBackground(e.target.value)}
                            placeholder="#000B58"
                            className="font-mono h-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm">Primary Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={localPrimary}
                            onChange={(e) => setLocalPrimary(e.target.value)}
                            className="w-12 h-12 p-1 cursor-pointer aspect-square"
                        />
                        <Input
                            value={localPrimary}
                            onChange={(e) => setLocalPrimary(e.target.value)}
                            placeholder="#498e77"
                            className="font-mono h-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm">Secondary Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={localSecondary}
                            onChange={(e) => setLocalSecondary(e.target.value)}
                            className="w-12 h-12 p-1 cursor-pointer aspect-square"
                        />
                        <Input
                            value={localSecondary}
                            onChange={(e) => setLocalSecondary(e.target.value)}
                            placeholder="#006a67"
                            className="font-mono h-12"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 