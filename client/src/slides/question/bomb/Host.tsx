import { useState, useEffect } from 'react';
import { Participant } from '@/models/Quiz';
import Avatar, { genConfig } from 'react-nice-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon } from 'lucide-react';
import { BombSlide } from '@/models/Quiz';
import { ParticipantService } from '@/services/participant';
import { Button } from '@/components/ui/button';

const mockParticipants: Participant[] = [
  {
    answers: [
      { slideNumber: 1, answer: ['Yes'], time: '2024-11-18T10:05:00Z' },
      { slideNumber: 2, answer: ['No'], time: '2024-11-18T10:10:00Z' },
    ],
    hasAnswered: true,
    avatar: 'https://example.com/avatar1.png',
    name: 'Olle',
    participantId: 'P001',
    score: [8, 12],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    isTurn: false,
  },
  {
    answers: [
      { slideNumber: 1, answer: ['Maybe'], time: '2024-11-18T10:06:00Z' },
      { slideNumber: 2, answer: ['Yes'], time: '2024-11-18T10:11:00Z' },
    ],
    hasAnswered: true,
    avatar: 'https://example.com/avatar2.png',
    name: 'Bob Smith',
    participantId: 'P002',
    score: [10, 15],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    isTurn: false,
  },
  {
    answers: [{ slideNumber: 1, answer: ['No'], time: '2024-11-18T10:07:00Z' }],
    hasAnswered: true,
    avatar: 'https://example.com/avatar3.png',
    name: 'Charlie Brown',
    participantId: 'P003',
    score: [5],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    isTurn: false,
  },
  {
    answers: [],
    hasAnswered: false,
    avatar: 'https://example.com/avatar4.png',
    name: 'Diana Prince',
    participantId: 'P004',
    score: [],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    isTurn: false,
  },
  {
    answers: [
      { slideNumber: 1, answer: ['Agree'], time: '2024-11-18T10:08:00Z' },
      { slideNumber: 3, answer: ['Disagree'], time: '2024-11-18T10:15:00Z' },
    ],
    hasAnswered: true,
    avatar: 'https://example.com/avatar5.png',
    name: 'Ethan Hunt',
    participantId: 'P005',
    score: [9, 11],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    isTurn: false,
  },
];

type HostProps = {
  participants: Participant[];
  slide: BombSlide;
  quizCode: string;
  slideNumber: number;
  onNextSlide: () => void;
};

type ParticipantHearts = {
  participantId: string;
  hearts: number;
};

export function Host({
  participants = mockParticipants,
  slide,
  quizCode,
  slideNumber,
  onNextSlide,
}: HostProps) {
  const [time, setTime] = useState(1000000000);
  const [currentParticipants, setCurrentParticipants] = useState(participants);
  const [participantHearts, setParticipantHearts] = useState<
    ParticipantHearts[]
  >([]);

  const [winner, setWinner] = useState<Participant | null>(null);
  const [hasUpdatedDatabaseDontDelete, setHasUpdatedDatabaseDontDelete] =
    useState(false);
  const [userAnswer, setUserAnswer] = useState('Answer');
  const [answers] = useState<string[]>(slide.answers || []);
  const [usedAnswers, setUsedAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState('');
  const [deadParticipants, setDeadParticipants] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const initializeHeartsAndTime = () => {
    const newParticipantHearts = participants.map((participant) => {
      // Check if slide.participantHearts is defined and is an array
      const existingHeart = Array.isArray(slide.participantHearts)
        ? slide.participantHearts.find(
            (ph) => ph.participantId === participant.participantId
          )
        : null;

      return {
        participantId: participant.participantId, // Participant ID is a string
        hearts: Math.min(existingHeart?.hearts ?? slide.hearts, 5), // Default to slide.hearts if not found, capped at 5
      };
    });
    setTime(slide.initialTime || 20)
    setParticipantHearts(newParticipantHearts);
  };

  // Utility function to skip participants with no hearts
  const getNextParticipantIndex = (startIndex: number): number => {
    const totalParticipants = currentParticipants.length;
    let index = startIndex;

    while (
      (participantHearts.find(
        (ph) => ph.participantId === currentParticipants[index].participantId
      )?.hearts ?? 0) <= 0 // Default to 0 if undefined
    ) {
      index = (index + 1) % totalParticipants;

      if (index === startIndex) break; // Prevent infinite loop if all participants are out of hearts
    }

    return index;
  };

  useEffect(() => {
    if (participants) {
      // Update currentParticipants while retaining the original order
      setCurrentParticipants((prevParticipants) =>
        prevParticipants.map(
          (prevParticipant) =>
            participants.find(
              (participant) =>
                participant.participantId === prevParticipant.participantId
            ) || prevParticipant
        )
      );
    }
  }, [participants]);
  useEffect(() => {
    const handleParticipant = async () => {
      if (currentParticipants.length > 0 && !isTransitioning) {
        // Only proceed if not transitioning
        const currentParticipant = currentParticipants[0];
        const lastTempAnswer = currentParticipant.tempAnswer;
  
        // If the answer is correct and not used
        if (
          lastTempAnswer &&
          answers.includes(lastTempAnswer.tempAnswer) &&
          !usedAnswers.includes(lastTempAnswer.tempAnswer)
        ) {
          console.log(lastTempAnswer.tempAnswer, 'User answer is correct');
  
          // Temporarily store updated usedAnswers
          const updatedUsedAnswers = [
            ...usedAnswers,
            lastTempAnswer.tempAnswer,
          ];
  
          setIsCorrect('true');
          setUsedAnswers(updatedUsedAnswers);
          setUserAnswer(lastTempAnswer.tempAnswer);
  
          // Lock transitions during the state update process
          setIsTransitioning(true);
  
          // Wait for 1.2 seconds to display the color change
          setTimeout(async () => {
            setIsCorrect(''); // Reset the visual state
  
            // Clear the user answer before rotating to the next participant
            setUserAnswer('');
  
            // Rotate participants
            setCurrentParticipants((prevParticipants) => {
              const nextIndex = getNextParticipantIndex(1); // Rotate participants
              return [
                ...prevParticipants.slice(nextIndex),
                ...prevParticipants.slice(0, nextIndex),
              ];
            });
  
            try {
              // Remove tempAnswer for the current participant
              await ParticipantService.removeTempAnswer(
                quizCode,
                currentParticipant.participantId
              );
            } catch (error) {
              console.error('Failed to remove tempAnswer for user:', error);
            }
  
            // Reset the timer
            setTime(slide.initialTime);
  
            setIsTransitioning(false); // Unlock transitions
          }, 1200);
        } else if (
          lastTempAnswer &&
          !answers.includes(lastTempAnswer.tempAnswer)
        ) {
          setIsCorrect('false');
          setUserAnswer(lastTempAnswer.tempAnswer);
        } else if (
          lastTempAnswer &&
          usedAnswers.includes(lastTempAnswer.tempAnswer)
        ) {
          // Prevent marking answer as correct if already used
          console.log('Answer already used');
  
          // Check if transition time is nearly over and prevent marking correct
          if (time > 300) {  // A small buffer (300ms), adjust as needed
            setIsTransitioning(true);
            setIsCorrect('used');
            setUserAnswer(lastTempAnswer.tempAnswer);
          } else {
            setIsCorrect(''); // Reset it before transition
          }
  
          // Prevent transition if the answer is already used
          setIsTransitioning(false); // Unlock transitions immediately
        }
      }
    };
    handleParticipant();
  }, [currentParticipants, time]); // Ensure the time also triggers this effect when changed
  
  

  const updateHearts = (participantHearts: ParticipantHearts[]) => {
    // call firebase and update hearts for the user that lost hearts
    console.log(participantHearts);
  };

  // Countdown effect
  useEffect(() => {
    if (time <= 0) return;

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  // Rotate participants on "x" key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'x') {
        setCurrentParticipants((prevParticipants) => {
          const totalParticipants = prevParticipants.length;
          const currentIndex = 0; // Big avatar is always the first participant
          const nextIndex = getNextParticipantIndex(
            (currentIndex + 1) % totalParticipants
          );

          // Reorganize participants array based on the new first participant
          return [
            ...prevParticipants.slice(nextIndex),
            ...prevParticipants.slice(0, nextIndex),
          ];
        });
        setTime(slide.initialTime); // Reset the timer
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [slide.initialTime, participantHearts]);

  useEffect(() => {
    if (time === 0 && !isTransitioning) {
      // Only proceed if not transitioning
      const currentPlayerId = currentParticipants[0].participantId; // Current participant's ID

      // Decrease heart count
      setParticipantHearts((prevHearts) => {
        const updatedHearts = prevHearts.map((ph) =>
          ph.participantId === currentPlayerId
            ? { ...ph, hearts: Math.max(0, ph.hearts - 1) } // Decrease hearts but ensure it doesn't go below 0
            : ph
        );

        // Check if the current participant's hearts reach 0
        const currentParticipant = updatedHearts.find(
          (ph) => ph.participantId === currentPlayerId
        );
        if (currentParticipant && currentParticipant.hearts === 0) {
          setDeadParticipants((prevDead) => [...prevDead, currentPlayerId]); // Add participant ID to deadParticipants
        }

        return updatedHearts;
      });

      // Identify alive participants
      const aliveParticipants = currentParticipants.filter((p) => {
        const hearts =
          participantHearts.find((ph) => ph.participantId === p.participantId)
            ?.hearts ?? 0;
        return hearts > 0; // Keep participants with hearts > 0
      });
      console.log(aliveParticipants.length, "alive.length")
      console.log("winner",winner,"hasupdated",hasUpdatedDatabaseDontDelete)
      if (
        ((currentParticipants.length)-deadParticipants.length) === 1 &&
        !winner &&
        !hasUpdatedDatabaseDontDelete
      ) {
        sendAnswersToDatabase(aliveParticipants);
      }

      //updateHearts(participantHearts);

      // Skip to the next participant if the current one has no hearts
      setCurrentParticipants((prevParticipants) => {
        const currentIndex = 0; // The current participant is always the first in the array
        const nextIndex = getNextParticipantIndex(currentIndex + 1); // Find the next participant with hearts

        return [
          ...prevParticipants.slice(nextIndex),
          ...prevParticipants.slice(0, nextIndex),
        ];
      });

      // Reset the timer
      setTime(slide.initialTime);
    }
  }, [
    time,
    currentParticipants,
    participantHearts,
    slide.initialTime,
    isTransitioning,
  ]);

  // Effect for when there are no more correct answer the game should finish
  // check after correvt ansewer if statment is true in const
  useEffect(() => {
    if (usedAnswers.length == answers.length) {
      // fix so remaining players are all winners
    }
  }, [usedAnswers]);

  async function sendAnswersToDatabase(aliveParticipants: Participant[]) {
    setWinner(aliveParticipants[0]); // Set the winner if only one participant remains with hearts > 0

    const currentPlayerId = currentParticipants[0].participantId;

    // Update deadParticipants state correctly
    setDeadParticipants((prevDead) => {
      const newDeadParticipants = [...prevDead, currentPlayerId]; // Add the current player to deadParticipants

      // Call addAnswer for all dead participants
      const addAnswerPromises = newDeadParticipants.map(
        async (participantId, index) => {
          try {
            // Convert the index to a string and send it as the answer
            const result = await ParticipantService.addAnswer(
              quizCode,
              participantId,
              [index.toString()], // Send the index as a string
              slideNumber
            );
            if (result) {
              console.log(
                `Answer successfully submitted for participant: ${participantId}`
              );
            } else {
              console.error(
                `Failed to submit answer for participant: ${participantId}`
              );
            }
          } catch (error) {
            console.error(
              `Error submitting answer for participant ${participantId}:`,
              error
            );
          }
        }
      );

      // Wait for all promises to resolve (optional if you want to wait until all answers are processed)
      Promise.all(addAnswerPromises)
        .then(() => {
          console.log("All dead participants' answers processed.");
        })
        .catch((error) => {
          console.error(
            'Error processing answers for dead participants:',
            error
          );
        });

      return newDeadParticipants; // Update the state correctly after adding the current player
    });
    setHasUpdatedDatabaseDontDelete(true);
  }

  if (winner) {
    // Render the Winner Screen
    return (
      <motion.div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 className="font-display text-6xl">Winner is {winner.name}!</h1>
        <Avatar
          style={{
            width: '12rem', // Make sure the size is large enough
            height: '12rem', // Make sure the size is large enough
          }}
          {...genConfig(winner.avatar)}
        />
        <Button
          onClick={() => {
            onNextSlide();
          }}
          className="absolute bottom-5 right-5"
        >
          Next Slide
        </Button>
      </motion.div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '4rem',
      }}
    >
      {/* Title moved outside of the motion.div */}
      <div className="gap-4rem mt-4 rounded-lg bg-[#F4F3F2] text-black mb-4 flex justify-center font-display text-4xl items-center w-full">
        <h1 className="p-4">{slide.title}</h1>
      </div>

      <motion.div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '4rem',
          width: '100%', // Ensure width is properly set
        }}
      >
        <AnimatePresence mode="wait">
          {currentParticipants[0] &&
            (participantHearts.find(
              (ph) => ph.participantId === currentParticipants[0].participantId
            )?.hearts ?? 0) > 0 && (
              <motion.div
                key={currentParticipants[0].name}
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: '0%' }}
                exit={{ opacity: 0, y: '+100%' }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  zIndex: 2,
                  width: '100%', // Ensure full width for content
                }}
              >
                <div className="  items-center bg-component-background rounded-lg grid grid-cols-2 gap-4 p-4">
                  {/* Timer stays in the first column */}
                  <div className="flex-col justify-center items-center font-display">
                    <h2 className=" text-black text-5xl">{time}</h2>
                    <div className="mt-4 text-4xl">
                      <h3 className="text-black font-display">
                        {currentParticipants[0].name}
                      </h3>
                    </div>
                    <div className="mt-4 justify-center items center flex gap-0.5rem">
                      {Array.from({
                        length:
                          participantHearts.find(
                            (ph) =>
                              ph.participantId ===
                              currentParticipants[0].participantId
                          )?.hearts || 0,
                      }).map((_, index) => (
                        <HeartIcon key={index} fill="#FF4545" color="#FF4545" />
                      ))}
                    </div>
                  </div>

                  {/* Avatar stays in the second column, center aligned */}
                  <motion.div
                    className=" flex-col items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <Avatar
                      style={{
                        width: '8rem',

                        height: '8rem', // Ensure avatar size is big
                      }}
                      {...genConfig(currentParticipants[0].avatar)}
                    />
                  </motion.div>
                </div>
                <div className="mt-16 flex justify-center items-center">
                  <div
                    className={`p-2 px-4 rounded-md text-black font-display text-2xl ${
                      userAnswer === ''
                        ? 'bg-white' // White background for empty answer
                        : isCorrect === 'true'
                          ? 'bg-green-500' // Green for 'true'
                          : isCorrect === 'false'
                            ? 'bg-red-500' // Red for 'false'
                            : isCorrect === 'used'
                              ? 'bg-yellow-500' // Yellow for 'used'
                              : 'bg-white' // Default to white
                    }`}
                  >
                    {userAnswer === '' ? 'Answering...' : userAnswer}
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Avatar Row */}
        <motion.div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4rem',
            width: '100%',
            padding: '1rem 2rem',
            overflow: 'hidden',
          }}
        >
          {currentParticipants.map((participant) => (
            <motion.div
              key={participant.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                filter:
                  (participantHearts.find(
                    (ph) => ph.participantId === participant.participantId
                  )?.hearts ?? 0) > 0
                    ? 'none'
                    : 'grayscale(100%)',
              }}
            >
              <Avatar
                style={{
                  width: '6rem',
                  height: '6rem',
                }}
                {...genConfig(participant.avatar)}
              />
              <h3 className="font-display">{participant.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(participantHearts.find(
                  (ph) => ph.participantId === participant.participantId
                )?.hearts ?? 0) > 0 ? (
                  Array.from({
                    length:
                      participantHearts.find(
                        (ph) => ph.participantId === participant.participantId
                      )?.hearts ?? 0,
                  }).map((_, index) => (
                    <HeartIcon key={index} fill="#FF4545" color="#FF4545" />
                  ))
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>💀</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <div>
        <Button className="m-4 p-6" onClick={initializeHeartsAndTime}>
          Start game
        </Button>
        <Button className="m-4 p-6">Pause game</Button>
      </div>
    </div>
  );
}

export default Host;
