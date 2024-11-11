import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

export function ColorInput({ label, value, onChange, placeholder }: ColorInputProps) {
    return (
        <div className="space-y-2">
            <Label className="text-sm">{label}</Label>
            <div className="flex gap-2">
                <Input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer aspect-square"
                />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="font-mono h-12"
                />
            </div>
        </div>
    );
} 