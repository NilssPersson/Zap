import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import { ColorInput } from "./ColorInput";
import { ShowCorrectAnswerTypes } from "@/models/Quiz";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Quiz, QuizSettings } from "@/models/Quiz";
import { quizDefaults } from "./utils/quiz-defaults";

interface QuizSettingsToolbarProps {
    quiz: Quiz;
    onUpdate: (updates: { 
        quizName?: string; 
        settings?: QuizSettings;
    }) => void;
}

export function QuizSettingsToolbar({ 
    quiz,
    onUpdate 
}: QuizSettingsToolbarProps) {
    const { quiz_name } = quiz
    const originalSettings = useMemo(() => ({
        ...quizDefaults,
        ...quiz.settings,
    }), [quiz.settings]);
    
    const handleColorChange = (colorKey: string, value: string) => {
        const hexRegex = /^#[0-9A-F]{6}$/i;
        if (hexRegex.test(value)) {
            onUpdate({ settings: { ...originalSettings, [colorKey]: value } });
        }
    };

    return (
        <div className="h-full bg-secondary/90 p-4 flex flex-col gap-4 overflow-y-auto text-black">
            <div className="space-y-2">
                <Label>Quiz Name</Label>
                <Input
                    value={quiz_name}
                    onChange={(e) => onUpdate({ quizName: e.target.value })}
                    className="text-xl font-bold"
                    placeholder="Quiz Name"
                />
            </div>

            <div className="space-y-4">
                <Label>Color Scheme</Label>
                
                <ColorInput
                    label="Background Color"
                    value={originalSettings.backgroundColor}
                    onChange={(value) => handleColorChange('backgroundColor', value)}
                    placeholder="#000B58"
                />

                <ColorInput
                    label="Primary Color"
                    value={originalSettings.primaryColor}
                    onChange={(value) => handleColorChange('primaryColor', value)}
                    placeholder="#498e77"
                />

                <ColorInput
                    label="Secondary Color"
                    value={originalSettings.secondaryColor}
                    onChange={(value) => handleColorChange('secondaryColor', value)}
                    placeholder="#006a67"
                />
            </div>

            <div className="space-y-2">
                <Label>Show Correct Answer</Label>
                <Select
                    value={originalSettings.showCorrectAnswerDefault || "auto"}
                    onValueChange={(value) => onUpdate({ settings: { ...originalSettings, showCorrectAnswerDefault: value as ShowCorrectAnswerTypes } })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
} 