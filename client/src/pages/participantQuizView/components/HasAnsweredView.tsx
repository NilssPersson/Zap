import { useState, useEffect } from "react";

const quotes = [
  "Well, that was fast. But was it right? 🤔",
  "Speed isn’t everything... unless it’s wrong. 😅",
  "Quick answer! Let's hope it's not a quick mistake. 😏",
  "Are you confident, or just really fast? 🏎️",
  "Fast answer, bold move! Let’s see if it pays off. 🧐",
  "Thinking is overrated anyway, right? 😜",
  "That was speedy! But was it... considered? 🕵️",
  "You might have set a record for speed—accuracy, though? We'll see! 🕐",
];

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

export default function HasAnsweredView() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full pt-80">
      <h1 className="text-3xl font-display text-center">{quote}</h1>
    </div>
  );
}
