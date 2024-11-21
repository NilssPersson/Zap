import { InfoSlide } from "@/models/Quiz";
import { Render } from "./Render";

export function Preview({ slide }: { slide: InfoSlide }) {
    return <Render slide={slide} />
}