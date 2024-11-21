import { InfoSlide } from "@/models/Quiz";
import { Render } from "./Render";

export function Participant({ slide }: { slide: InfoSlide }) {
    return <Render slide={slide} />
}