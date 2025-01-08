import { ClosestSlide, Participant } from '@/models/Quiz';
import { ParticipantAnswers } from '@/slides/_components/ParticipantAnswers';
import SlideTitleSpecial from '@/slides/_components/SlideTitleSpecial';
import { Target } from 'lucide-react';
import NextSlide from '@/slides/_components/NextSlide';

interface HostProps {
  slide: ClosestSlide;
  participants: Participant[];
  removeParticipant: (participantId: string) => void;
  onNextSlide: () => void
  onPrevSlide: () => void
}

export function Host({ slide, participants, removeParticipant, onNextSlide, onPrevSlide }: HostProps) {

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
     
      <div className="flex flex-col items-center justify-center p-8 space-y-5 bg-white rounded-lg">
        <SlideTitleSpecial title={slide.title} icon={Target} />
      </div>

      <ParticipantAnswers
        participants={participants}
        removeParticipant={removeParticipant}
      />
      <NextSlide onNext={onNextSlide} onPrev={onPrevSlide}></NextSlide>
    </div>
  );
} 