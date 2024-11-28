import { GameShackTitle } from "@/components/GameShackTitle";
import QRCode from "react-qr-code";

interface TitleProps {
  title?: string;
  quizCode: string;
}

export default function Title({ title = "Loading...", quizCode }: TitleProps) {
  return (
    <div className="flex gap-4 items-center justify-center w-full">

      <div className="flex flex-col gap-4 items-center justify-center bg-card w-fit p-4 rounded-lg">
        <span className="text-5xl font-display text-primary-foreground">Lobby Code: {quizCode}</span>
        <QRCode
          style={{ height: "auto", width: "300px", margin: "3" }}
          value={`${import.meta.env.VITE_QR_BASE_URL}${quizCode}`}
          viewBox={`0 0 256 256`}
        />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <span className="flex flex-col gap-4 items-center">
          <span className="text-2xl flex items-center gap-2"><GameShackTitle icon={false} className="text-5xl" /> is starting:</span>
          <span className="text-6xl font-display w-fit">{title}</span>
        </span>
      </div>
    </div>
  );
}
