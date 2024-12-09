import { useState, useEffect } from 'react';
import { Participant } from '@/models/Quiz';
import Avatar, { genConfig } from 'react-nice-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon } from 'lucide-react';
import { BombSlide } from '@/models/Quiz';

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

type PreviewProps = {
  participants: Participant[];
  slide: BombSlide;
};

type ParticipantHearts = {
  participantId: string;
  hearts: number;
};

export function Host({ participants = mockParticipants, slide }: PreviewProps) {
  const [time, setTime] = useState(slide.initialTime || 100);
  const [currentParticipants, setCurrentParticipants] = useState(participants);
  const [participantHearts, setParticipantHearts] = useState<
    ParticipantHearts[]
  >([]);

  const [winner, setWinner] = useState<Participant | null>(null);
  const [userAnswer] = useState('TempAnswer');
  const [answers, setAnswers] = useState<string[]>(slide.answers || []);
  const [usedAnswers, setUsedAnswers] = useState<string[]>([]);

  const initializeHearts = () => {
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
    if (currentParticipants.length > 0) {
      const currentParticipant = currentParticipants[0];
  
      console.log(currentParticipant);
  
      // Check if the last tempAnswer matches an available answer
      const lastTempAnswer = currentParticipant.tempAnswer;
  
      console.log(lastTempAnswer);
  
      if (
        lastTempAnswer && // Ensure there's a lastTempAnswer
        answers.includes(lastTempAnswer.tempAnswer) && // Check if tempAnswer exists in answers
        !usedAnswers.includes(lastTempAnswer.tempAnswer) // Ensure tempAnswer is not in usedAnswers
      ) {
        console.log("Answer was correct");
  
        // Update the state: move the answer to usedAnswers
        const newAnswers = answers.filter(
          (answer) => answer !== lastTempAnswer.tempAnswer
        );
        const newUsedAnswers = [...usedAnswers, lastTempAnswer.tempAnswer];
  
        // Update used answers
        setAnswers(newAnswers);
        setUsedAnswers(newUsedAnswers);
  
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
    }
  }, [currentParticipants, answers, usedAnswers]);
  

  const updateHearts = (participantHearts: ParticipantHearts[]) => {
    // call firebase and update hearts for the user that lost hearts
    console.log(participantHearts)
  };

  useEffect(() => {
    // Call the temporary function to initialize participant hearts
    initializeHearts();
  }, [participants, slide.hearts]);

  // Sync participantHearts when slide.hearts changes
  useEffect(() => {
    if (participants && slide.hearts !== undefined) {
      initializeHearts(); // Reinitialize hearts when slide.hearts changes
    }
  }, [slide.hearts, participants]);

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
    if (time === 0) {
      const currentPlayerId = currentParticipants[0].participantId; // Current participant's ID

      // Decrease heart count
      setParticipantHearts((prevHearts) =>
        prevHearts.map((ph) =>
          ph.participantId === currentPlayerId
            ? { ...ph, hearts: Math.max(0, ph.hearts - 1) } // Decrease hearts but ensure it doesn't go below 0
            : ph
        )
      );
      updateHearts(participantHearts);
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
    setParticipantHearts,
    setCurrentParticipants,
    setTime,
  ]);

  useEffect(() => {
    // Filter out dead participants (those with 0 hearts)
    const aliveParticipants = currentParticipants.filter((p) => {
      const hearts =
        participantHearts.find((ph) => ph.participantId === p.participantId)
          ?.hearts ?? 0;
      return hearts > 0; // Keep participants with hearts > 0
    });

    if (aliveParticipants.length === 1) {
      setWinner(aliveParticipants[0]); // Set the winner if only one participant remains with hearts > 0
    }
  }, [currentParticipants, participantHearts, setWinner]);

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
            width: '12rem',
            height: '12rem',
          }}
          {...genConfig(winner.avatar)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '8rem',
      }}
    >
      <div>
        <div className="gap-4rem mt-4 rounded-lg bg-[#F4F3F2] text-black mb-4 flex justify-center font-display text-4xl items-center w-full">
          <h1 className="p-4">{slide.title}</h1>
        </div>

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
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Timer stays in the first column */}
                  <div className="flex-col justify-center items-center font-display">
                    <h2 className="text-5xl">{time}</h2>
                    <div className="mt-4 text-4xl">
                      <h3 className="font-display">
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
                    className="flex flex-col items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <Avatar
                      style={{
                        width: '8rem',
                        height: '8rem',
                      }}
                      {...genConfig(currentParticipants[0].avatar)}
                    />
                  </motion.div>

                  {/* Name and Hearts placed under the timer in the first column */}
                  <div className="flex flex-col items-center justify-center col-span-1"></div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="bg-white p-2 px-4 rounded-md text-black font-display text-2xl">
                    {userAnswer}
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

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
  );
}

export default Host;
