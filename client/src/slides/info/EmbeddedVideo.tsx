import { getYoutubeEmbedUrl } from "./utils";

interface EmbeddedVideoProps {
  url: string;
}

function EmbeddedVideo({ url }: EmbeddedVideoProps) {

  const src = getYoutubeEmbedUrl(url);

  return (
    <div className="aspect-w-16 aspect-h-9 justify-self-center">
      <iframe
        width="560"
        height="315"
        src={src}
        title="YouTube video player"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export default EmbeddedVideo;
