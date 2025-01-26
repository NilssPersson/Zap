import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import jeopardy from '@/assets/questionImages/jeopardy.png';
import fa from '@/assets/questionImages/fa.png';
import locateit from '@/assets/questionImages/locateit.png';
import match from '@/assets/questionImages/match.png';
import rank from '@/assets/questionImages/rank.png';
import { LocateIt, Matching, Rank, FA, Jeopardy } from '@/slides';

export default function QuestionCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const images = [
    {
      img: locateit,
      title: t('questions:LOCATEIT'),
      text: t('homepage:questionDescriptions.locateit'),
      icon: LocateIt.Info.icon,
      iconColor: LocateIt.Info.iconColor,
    },
    {
      img: fa,
      title: t('questions:FA'),
      text: t('homepage:questionDescriptions.fastest'),
      icon: FA.Info.icon,
      iconColor: FA.Info.iconColor,
    },
    {
      img: match,
      title: t('questions:MATCHING'),
      text: t('homepage:questionDescriptions.matching'),
      icon: Matching.Info.icon,
      iconColor: Matching.Info.iconColor,
    },
    {
      img: jeopardy,
      title: t('questions:JEOPARDY'),
      text: t('homepage:questionDescriptions.jeopardy'),
      icon: Jeopardy.Info.icon,
      iconColor: Jeopardy.Info.iconColor,
    },
    {
      img: rank,
      title: t('questions:RANK'),
      text: t('homepage:questionDescriptions.rank'),
      icon: Rank.Info.icon,
      iconColor: Rank.Info.iconColor,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full bg-background">
      <h1 className="text-3xl font-display text-center text-foreground mb-2 bg-secondary w-fit mx-auto p-2 rounded-lg">
        {t('homepage:questionCarouselText')}
      </h1>

      {/* Icon navigation */}

      {count > 0 && (
        <div className="flex gap-4 my-4">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)} // Navigate to the selected image
              className={cn(
                'p-2 rounded-full transition-colors duration-200 ease-in transform ',
                current === i
                  ? 'bg-primary text-foreground scale-110'
                  : 'bg-secondary text-black'
              )}
              aria-label={`Go to ${image.title}`}
            >
              {
                <image.icon
                  size={25}
                  strokeWidth={2}
                  color={current === i ? 'white' : image.iconColor}
                />
              }
            </button>
          ))}
        </div>
      )}

      <div className="w-full">
        <Carousel
          setApi={setApi}
          increment={1}
          rotateTime={250}
          buttons={false}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="flex justify-center flex-col items-center m-4 relative group">
                  <div className="w-full mx-16 max-w-[400px] md:max-w-[500px] lg:max-w-[800px] overflow-hidden relative">
                    <img
                      src={image.img}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-[160px] md:h-[240px] lg:h-[370px] object-cover rounded-lg"
                    />
                    <div className="flex flex-col h-[140px] py-1 px-1 md:p-5">
                      <p className="text-lg font-display text-foreground lg:text-xl m-0 md:mb-1">
                        {image.title}
                      </p>
                      <p className="text-sm lg:text-base text-foreground tracking-tight">
                        {image.text}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
