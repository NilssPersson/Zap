import { useEffect, useState } from 'react';

interface WiggleTextProps {
    text: string;
    className?: string;
}

export function WiggleText({ text, className = "" }: WiggleTextProps) {
    const [rotations, setRotations] = useState<number[]>([]);
    
    useEffect(() => {
        // Initial random rotations
        setRotations(Array.from({ length: text.length }, () => 
            (Math.random() - 0.5) * 10
        ));

        // Update rotations every 500ms
        const interval = setInterval(() => {
            setRotations(Array.from({ length: text.length }, () => 
                (Math.random() - 0.5) * 10
            ));
        }, 750);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <div className={className}>
            {text.split("").map((char, idx) => (
                <span 
                    key={idx} 
                    className="inline-block transition-transform duration-500"
                    style={{ transform: `rotate(${rotations[idx]}deg)` }}
                >
                    {char}
                </span>
            ))}
        </div>
    );
} 