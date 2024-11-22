import { WiggleText } from "@/components/WiggleText";
import { cn } from "@/lib/utils";

interface SlideTitleProps {
    title: string;
    size?: "large" | "small";
    wiggle?: boolean;
}

export function SlideTitle({ title, size = "large", wiggle = false }: SlideTitleProps) {
    const className = cn("font-display text-center leading-tight",
        size === "large" ? "text-8xl" : "text-4xl"
    );
    
    return wiggle ? (
        <WiggleText className={className} text={title} />
    ) : (
        <h2 className={className}>{title}</h2>
    );
} 