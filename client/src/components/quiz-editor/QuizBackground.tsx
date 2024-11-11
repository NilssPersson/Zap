import { useMemo } from "react";

interface QuizBackgroundProps {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    className?: string;
}

export function QuizBackground({ primaryColor = "006a67", secondaryColor = "#498e77", backgroundColor = "#000B58", className }: QuizBackgroundProps) {
    const svgContent = useMemo(() => {
        // Create gradient colors from primary to secondary
        const colors = [
            backgroundColor,
            primaryColor,
            interpolateColor(primaryColor, secondaryColor, 0.33),
            interpolateColor(primaryColor, secondaryColor, 0.66),
            secondaryColor
        ];

        return `
            <svg id="visual" viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <rect x="0" y="0" width="960" height="540" fill="${colors[0]}"></rect>
                <path d="M0 333L22.8 337.5C45.7 342 91.3 351 137 356.8C182.7 362.7 228.3 365.3 274 369C319.7 372.7 365.3 377.3 411.2 373C457 368.7 503 355.3 548.8 345.3C594.7 335.3 640.3 328.7 686 327.2C731.7 325.7 777.3 329.3 823 339.7C868.7 350 914.3 367 937.2 375.5L960 384L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z" fill="${colors[1]}"></path>
                <path d="M0 427L22.8 418.7C45.7 410.3 91.3 393.7 137 385.7C182.7 377.7 228.3 378.3 274 386.2C319.7 394 365.3 409 411.2 405.3C457 401.7 503 379.3 548.8 379C594.7 378.7 640.3 400.3 686 410.8C731.7 421.3 777.3 420.7 823 417.5C868.7 414.3 914.3 408.7 937.2 405.8L960 403L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z" fill="${colors[2]}"></path>
                <path d="M0 445L22.8 440.2C45.7 435.3 91.3 425.7 137 420.7C182.7 415.7 228.3 415.3 274 420.2C319.7 425 365.3 435 411.2 436.5C457 438 503 431 548.8 428.5C594.7 426 640.3 428 686 429.2C731.7 430.3 777.3 430.7 823 433.3C868.7 436 914.3 441 937.2 443.5L960 446L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z" fill="${colors[3]}"></path>
                <path d="M0 500L22.8 498.3C45.7 496.7 91.3 493.3 137 494C182.7 494.7 228.3 499.3 274 502.2C319.7 505 365.3 506 411.2 504.2C457 502.3 503 497.7 548.8 497.3C594.7 497 640.3 501 686 503.8C731.7 506.7 777.3 508.3 823 508.7C868.7 509 914.3 508 937.2 507.5L960 507L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z" fill="${colors[4]}"></path>
            </svg>
        `;
    }, [primaryColor, secondaryColor, backgroundColor]);

    const dataUrl = useMemo(() => {
        return `data:image/svg+xml;base64,${btoa(svgContent)}`;
    }, [svgContent]);

    return (
        <div 
            className={className} 
            style={{ 
                backgroundImage: `url("${dataUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        />
    );
}

// Helper function to interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    
    return rgbToHex(r, g, b);
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
} 