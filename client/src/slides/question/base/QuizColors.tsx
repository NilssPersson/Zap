export const getColor = (index: number): string => {
    const colors = [
      "rgb(178,0,255)", // Purple
      "rgb(255,0,195)", // Pink
      "rgb(0,230,255)", // Light Blue
      "rgb(255,204,0)", // Yellow
      "rgb(255,128,0)", // Orange
      "rgb(0,0,255)", // Blue
      "rgb(255,0,0)", // Red
      "rgb(0,255,0)", // Green
    ];
    return colors[index % colors.length]; // Loop through colors if there are more options
  };


  export const yesNoColors = (isCorrect: boolean): string => {
    // Return 'green' if correct, 'red' if incorrect
    return isCorrect ? "rgb(154, 191, 128)" : "rgb(255, 69, 69)";
  };

  