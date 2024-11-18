import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addAnswer,
  useGameStatus,
  addParticipant,
  removeParticipant,
  getParticipant,
  checkIfGameExists,
  participantExists,
} from "@/services/client";
import TeamInfo from "./components/teamInfo";
import CreateParticipant from "./components/CreateParticipant";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function ParticipantLogic() {
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const { quizCode } = useParams();
  const [participantId, setParticipantId] = useState<string | undefined>(
    undefined,
  );
  const [cookies, setCookie, removeCookie] = useCookies(["participantId"]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkQuiz = async () => {
      if (!quizCode) return;
      const quizExists = await checkIfGameExists(quizCode);

      if (!quizExists) {
        navigate("/play");
        removeCookie("participantId");
      }
    };
    const fetchParticipant = async () => {
      if (!quizCode) return;
      if (cookies.participantId) {
        setParticipantId(cookies.participantId);
        const exists = await participantExists(quizCode, cookies.participantId);
        if (!exists) {
          removeCookie("participantId");
          setParticipantId(undefined);
        } else {
          try {
            const data = await getParticipant(
              quizCode as string,
              cookies.participantId,
            );
            setName(data.name);
            setAvatar(data.avatar);
          } catch (error) {
            console.error("Error fetching participant data:", error);
          }
        }
      }
    };

    fetchParticipant();
    checkQuiz();
  }, [cookies, quizCode, navigate, removeCookie]);

  async function handleRemoveParticipant() {
    if (!quizCode || !participantId) return;
    const res = await removeParticipant(quizCode, participantId);
    if (res) {
      removeCookie("participantId");
      navigate("/play");
    }
  }

  async function handleAddParticipant() {
    const createdId = await addParticipant(quizCode as string, name, avatar);
    setCookie("participantId", createdId);
    setParticipantId(createdId);
  }

  const { hasAnswered, currentSlide, score } = useGameStatus(
    quizCode as string,
    participantId as string,
  );

  async function answerQuestion() {
    if (!quizCode || !participantId || !answer) return;
    await addAnswer(quizCode, participantId, answer);
  }

  // Check if a participant has been created
  if (!participantId) {
    return (
      <CreateParticipant
        name={name}
        avatar={avatar}
        setName={setName}
        setAvatar={setAvatar}
        handleAddParticipant={handleAddParticipant}
      />
    );
  }

  return (
    <div>
      {/*Top: Leave functionality*/}
      <div className="fixed top-2 left-2 bg-[#F4F3F2] text-[#333333] rounded-md">
        <Button variant="ghost" onClick={handleRemoveParticipant}>
          <LogOut />
          Leave
        </Button>
      </div>
      {/*Middle: Quiz Question*/}
      <div className="flex-1  justify-center p-8">
        <div className="flex flex-col items-center justify-center w-full space-y-4 bg-[#F4F3F2] rounded-2xl p-8 mt-60 ">
          <Input
            value={answer}
            placeholder="Answer"
            className="text-black"
            onChange={(e) => setAnswer(e.target.value)}
          />
          <Button disabled={hasAnswered} onClick={answerQuestion}>
            Answer {currentSlide}
          </Button>
        </div>
      </div>
      {/*Bottom: Team info */}
      <TeamInfo name={name} score={score} avatar={avatar} />
    </div>
  );
}
