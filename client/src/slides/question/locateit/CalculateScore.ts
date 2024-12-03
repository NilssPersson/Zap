import { LocateItSlide,Participant } from "@/models/Quiz";
import { QuestionSlide } from "@/models/Quiz";


interface CalculateDistanceProps {
    coords1: {lat: number, lng: number};
    coords2: {lat: number, lng: number};
}

function CalculateDistance({coords1, coords2}: CalculateDistanceProps) {
    // First calculate the distance using the Haversine formula
    function toRad(x:number) {
        return (x * Math.PI) / 180;
      }
    
    const R = 6371; // Radius of the Earth in km
    const x1 = coords2.lat - coords1.lat;
    const dLat = toRad(x1);
    const x2 = coords2.lng - coords1.lng;
    const dLon = toRad(x2);
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coords1.lat)) *
          Math.cos(toRad(coords2.lat)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    
    return d*1000; 
}
interface CalculateScoreProps {
    slide: LocateItSlide;
    participants: Participant[];
    handleAddPoints: (pointsData: { participantId: string; awardPoints: number }[],
        slide: QuestionSlide,changeSlide:boolean) => void
}
export async function CalculateScore({ slide, participants, handleAddPoints }: CalculateScoreProps) {
    console.log(slide, participants, handleAddPoints);
    
    const correctLocation = slide.location;

    const participantsWithDistance = participants.map((participant) => {
        const latestAnswer =
        participant.answers.length > 0
          ? participant.answers[participant.answers.length - 1].answer
          : {0: 0, 1: 0};
        console.log(latestAnswer);
        console.log(correctLocation);
        const lat = Number(latestAnswer[0]);
        const lng = Number(latestAnswer[1]);
        const distance = CalculateDistance({coords1: {lat,lng}, coords2: correctLocation});
        return { participantId: participant.participantId, distance: distance };
    });

    console.log(participantsWithDistance);

    if(slide.awardPointsLocation === 'DISTANCE'){
        const participantsWithPoints = participantsWithDistance.map((participant) => {
            const distance = participant.distance;
            if(distance <= slide.radius){
                const points = Math.floor(slide.points * (1-distance/slide.radius));
                return {participantId: participant.participantId, awardPoints: points};
            }
            else{
                return {participantId: participant.participantId, awardPoints: 0};
            }
        }
        );
        handleAddPoints(participantsWithPoints, slide,false);
    }

    else if(slide.awardPointsLocation === 'RADIUS'){
        const participantsWithPoints = participantsWithDistance.map((participant) => {
            if(participant.distance <= slide.radius){
                return {participantId: participant.participantId, awardPoints: slide.points};
            }
            else{
                return {participantId: participant.participantId, awardPoints: 0};
            }
        }
        );
        handleAddPoints(participantsWithPoints, slide,false);
        }

    else if (slide.awardPointsLocation === 'CLOSEST'){
        console.log("Closest based points");
        const closestParticipant = participantsWithDistance.reduce((prev, current) => {
            return (prev.distance < current.distance) ? prev : current
        }
        );
        const participantsWithPoints = participantsWithDistance.map((participant) => {
            if(participant.participantId === closestParticipant.participantId){
                return {participantId: participant.participantId, awardPoints: slide.points};
            }
            else{
                return {participantId: participant.participantId, awardPoints: 0};
            }
        }
        );
        handleAddPoints(participantsWithPoints, slide,false);
    }

}