import { Participant } from "@/models/Quiz";
import { 
  DndContext, 
  DragEndEvent, 
  useSensors, 
  useSensor, 
  PointerSensor, 
  useDroppable,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { SetStateAction, Dispatch, useState } from "react";
import ParticipantCard from "./ParticipantCard";
import { cn } from "@/lib/utils";

interface TeamViewProps {
  numberOfTeams: number;
  participants: Participant[];
  teams: Team[];
  setTeams: Dispatch<SetStateAction<Team[]>>;
}

interface Team {
  id: string;
  name: string;
  participants: Participant[];
  isEditing?: boolean;
}

function TeamDropArea({ team, children }: { team: Team; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: team.id,
    data: {
      type: 'team',
      team: team
    }
  });

  return (
    <div ref={setNodeRef} className="min-h-[100px] flex-1 flex flex-col gap-2">
      {children}
      <div className={cn("min-h-10 bg-card/5 flex-1 rounded border-2 border-dashed", isOver && "bg-card/20 border-solid")} />
    </div>
  );
}

function SortableParticipant({ participant }: { participant: Participant }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: participant.participantId,
    data: {
      type: 'participant',
      participant: participant
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ParticipantCard participant={participant} />
    </div>
  );
}

export default function TeamView({ 
  teams,
  setTeams 
}: TeamViewProps): JSX.Element {
  const [activeParticipant, setActiveParticipant] = useState<Participant | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeTeam = teams.find(team => 
      team.participants.some(p => p.participantId === active.id)
    );
    
    if (activeTeam) {
      const participant = activeTeam.participants.find(
        p => p.participantId === active.id
      );
      if (participant) {
        setActiveParticipant(participant);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveParticipant(null);
    
    const { active, over } = event;
    if (!over) return;

    const participantId = active.id;
    const sourceTeamId = active.data.current?.sortable.containerId;
    const destinationTeamId = over.id as string;

    if (sourceTeamId === destinationTeamId) return;

    setTeams((currentTeams: Team[]) => {
      const newTeams = [...currentTeams];
      const sourceTeam = newTeams.find(team => team.id === sourceTeamId);
      const destTeam = newTeams.find(team => team.id === destinationTeamId);
      
      if (!sourceTeam || !destTeam) return currentTeams;

      const participantIndex = sourceTeam.participants.findIndex(
        (p: Participant) => p.participantId === participantId
      );
      
      if (participantIndex === -1) return currentTeams;

      const [participant] = sourceTeam.participants.splice(participantIndex, 1);
      destTeam.participants.push(participant);

      return newTeams;
    });
  };

  const handleTeamNameClick = (teamId: string) => {
    setTeams((currentTeams: Team[]) => 
      currentTeams.map((team: Team) => 
        team.id === teamId ? { ...team, isEditing: true } : team
      )
    );
  };

  const handleTeamNameBlur = (teamId: string) => {
    setTeams((currentTeams: Team[]) => 
      currentTeams.map((team: Team) => 
        team.id === teamId ? { ...team, isEditing: false } : team
      )
    );
  };

  const handleTeamNameChange = (teamId: string, newName: string) => {
    setTeams((currentTeams: Team[]) => 
      currentTeams.map((team: Team) => 
        team.id === teamId ? { ...team, name: newName } : team
      )
    );
  };

  const handleTeamNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, teamId: string) => {
    if (event.key === 'Enter') {
      handleTeamNameBlur(teamId);
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-black/50 backdrop-blur-md rounded-lg p-4 flex flex-col gap-2"
          >
            {team.id !== 'unassigned' ? (
              team.isEditing ? (
                <Input
                  value={team.name}
                  onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                  onBlur={() => handleTeamNameBlur(team.id)}
                  onKeyDown={(e) => handleTeamNameKeyDown(e, team.id)}
                  autoFocus
                  className="text-xl font-display text-black"
                />
              ) : (
                <h3 
                  className="text-xl font-display cursor-pointer hover:bg-black/20 p-2 rounded-lg"
                  onClick={() => handleTeamNameClick(team.id)}
                >
                  {team.name}
                </h3>
              )
            ) : (
              <h3 className="text-xl font-display p-2">{team.name}</h3>
            )}
            
            <SortableContext
              items={team.participants.map(p => p.participantId)}
              strategy={verticalListSortingStrategy}
              id={team.id}
            >
              <TeamDropArea team={team}>
                {team.participants.map((participant) => (
                  <SortableParticipant
                    key={participant.participantId}
                    participant={participant}
                  />
                ))}
              </TeamDropArea>
            </SortableContext>
          </div>
        ))}
      </div>
      
      <DragOverlay>
        {activeParticipant ? (
          <div className="transform-none">
            <ParticipantCard participant={activeParticipant} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
} 