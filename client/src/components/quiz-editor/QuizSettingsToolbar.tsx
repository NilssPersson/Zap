import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ColorInput } from "./ColorInput";

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
    const [localColors, setLocalColors] = useState({
        primary: primaryColor,
        secondary: secondaryColor,
        background: backgroundColor
    });

    // Validate and update colors when hex input changes
    useEffect(() => {
        const hexRegex = /^#[0-9A-F]{6}$/i;
        const colors = [
            { key: 'primaryColor', value: localColors.primary, original: primaryColor },
            { key: 'secondaryColor', value: localColors.secondary, original: secondaryColor },
            { key: 'backgroundColor', value: localColors.background, original: backgroundColor }
        ];

        colors.forEach(({ key, value, original }) => {
            if (hexRegex.test(value) && value !== original) {
                onUpdate({ [key]: value });
            }
        });
    }, [localColors, primaryColor, secondaryColor, backgroundColor, onUpdate]);

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
                
                <ColorInput
                    label="Background Color"
                    value={localColors.background}
                    onChange={(value) => setLocalColors(prev => ({ ...prev, background: value }))}
                    placeholder="#000B58"
                />

                <ColorInput
                    label="Primary Color"
                    value={localColors.primary}
                    onChange={(value) => setLocalColors(prev => ({ ...prev, primary: value }))}
                    placeholder="#498e77"
                />

                <ColorInput
                    label="Secondary Color"
                    value={localColors.secondary}
                    onChange={(value) => setLocalColors(prev => ({ ...prev, secondary: value }))}
                    placeholder="#006a67"
                />
            </div>
        </div>
    );
} 