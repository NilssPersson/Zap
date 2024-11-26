import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface SimpleSelectProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: Array<{
        value: string;
        label: string;
    }>;
}

export function SimpleSelect({ label, value, onValueChange, options }: SimpleSelectProps) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 