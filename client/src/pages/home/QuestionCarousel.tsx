import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import dallebomb from '@//utils/images/dalle/dallebomb.webp';
import dallebutton from '@/utils/images/dalle/dallebutton.webp';
import dalleflag1 from '@/utils/images/dalle/dalleflag1.webp';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const images = [
  {
    img: dallebomb,
    title: 'Ticking Time Bomb',
    text: 'In Ticking Timebomb, players take turns answering questions within a set time. If time runs out, you lose a life. The last player standing wins!',
  },
  {
    img: dalleflag1,
    title: 'Locate It',
    text: 'Think you know geography? Pin the right location on the world map! Choose from various difficulty levels, ranging from landmarks to precise locations, and test your knowledge with different settings!',
  },
  {
    img: dallebutton,
    title: 'Fastest Finger First',
    text: 'Know the answer? Press the button!',
  },
  {
    img: 'anotherImageURL',
    title: 'New image',
    text: 'Explanation for image 4',
  },
];

export default function QuestionCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const { t } = useTranslation(['homepage']);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const perSlide = 1;

  return (
    <div className="flex flex-col justify-center items-center w-full bg-[#F4F4F4]">
      <h1 className="text-3xl font-display text-black mt-4">
        {t('questionCarouselText')}
      </h1>

      <div className="text-center flex items-center justify-center w-full">
        <Carousel setApi={setApi} increment={1} rotateTime={15} buttons={false}>
          <CarouselContent>
            {images.map((_, groupIndex) => {
              // slice images for each "group" or "slide"
              const imageGroup =
                window.innerWidth < 640
                  ? images.slice(groupIndex, groupIndex + 1)
                  : images.slice(
                      groupIndex * perSlide,
                      groupIndex * perSlide + perSlide
                    );

              if (imageGroup.length === 0) return null;

              return (
                <CarouselItem key={groupIndex}>
                  <div className="flex justify-center">
                    {imageGroup.map((image, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center m-4 relative group"
                      >
                        <h2 className="text-xl font-display mb-2 text-black">
                          {image.title}
                        </h2>

                        {/* Fixed-width container for each card */}
                        <div className="rounded-lg shadow-md w-[300px] md:w-[500px] overflow-hidden relative">
                          <img
                            src={image.img}
                            alt={`Slide ${groupIndex * perSlide + index + 1}`}
                            className="w-full h-[200px] md:h-[300px] object-fit"
                          />
                          <div className="flex flex-col bg-white h-[130px]">
                            <p className="text-lg font-display text-left pl-2 text-black">
                              {image.title}
                            </p>
                            <p className="text-sm font-display text-left pl-2 text-gray-600">
                              {image.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Dot indicator */}
      <div className="pb-3">
        {count > 0 && (
          <div className="flex gap-2 my-2">
            {Array.from({ length: count }, (_, i) => {
              const slideIndex = i + 1;
              const isActive = slideIndex === current;

              return (
                <span
                  key={slideIndex}
                  className={cn(
                    'w-3 h-3 rounded-full transition-colors duration-300',
                    isActive ? 'bg-primary' : 'bg-gray-300'
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
