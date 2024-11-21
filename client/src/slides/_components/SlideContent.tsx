import { WiggleText } from "@/components/WiggleText";

interface SlideContentProps {
    content?: string;
    wiggle?: boolean;
}

export function SlideContent({ content, wiggle = false }: SlideContentProps) {
    if (!content) return null;

    const className = "text-[40px] text-center leading-normal";
    
    return wiggle ? (
        <WiggleText className={className} text={content} />
    ) : (
        <p className={className}>{content}</p>
    );
} 