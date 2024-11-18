import Avatar, { genConfig } from "react-nice-avatar";

interface TeamInfoProps {
  name: string;
  avatar: string;
  score: number;
}

export default function TeamInfo({ name, avatar, score }: TeamInfoProps) {
  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-[#333333] flex justify-between items-center p-2 w-[90%] max-w-xl rounded-lg shadow-md">
      <div className="flex items-center">
        <Avatar
          style={{ width: "2.5rem", height: "2.5rem" }}
          {...genConfig(avatar)}
        />
        <h1 className="pl-3 font-bold text-lg">{name}</h1>
      </div>
      <p className="text-xl font-semibold">{score}</p>
    </div>
  );
}
