import { WiggleText } from "@/components/WiggleText";

interface SlideTitleProps {
    title: string;
    size?: "large" | "small";
    wiggle?: boolean;
}

export function SlideTitle({ title, size = "large", wiggle = false }: SlideTitleProps) {
    const className = `font-display text-[${size === "large" ? "120px" : "60px"}] text-center leading-tight`;
    
    return wiggle ? (
        <WiggleText className={className} text={title} />
    ) : (
        <h2 className={className}>{title}</h2>
    );
} 