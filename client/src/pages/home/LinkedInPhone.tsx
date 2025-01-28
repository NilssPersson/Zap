import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import lisa from '@/assets/photos/lisa.jpeg';
import nils from '@/assets/photos/nils.jpeg';
import ramez from '@/assets/photos/ramez.jpeg';
import jacob from '@/assets/photos/jacob.jpeg';
import filip from '@/assets/photos/filip.jpeg';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';

interface LinkedInPhoneProps {
  readMore: boolean;
}

export default function LinkedInPhone({ readMore }: LinkedInPhoneProps) {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const people = [
    {
      src: lisa,
      name: 'Lisa Hansson',
      linkedin: 'https://www.linkedin.com/in/lisa-hansson/',
    },
    {
      src: nils,
      name: 'Nils Persson',
      linkedin: 'https://www.linkedin.com/in/nils-albin-persson/',
    },
    {
      src: ramez,
      name: 'Ramez Shakarna',
      linkedin: 'https://www.linkedin.com/in/ramezshakarna/',
    },
    {
      src: filip,
      name: 'Filip von Knorring',
      linkedin: 'https://www.linkedin.com/in/filip-v-4b9976139/',
    },
    {
      src: jacob,
      name: 'Jacob Dillström',
      linkedin: 'https://www.linkedin.com/in/jacob-dillstrom/',
    },
  ];

  return (
    <div className="relative flex flex-col justify-center items-center w-full pt-10 px-4 pb-5">
      {!readMore && (
        <>
          <div className="absolute inset-0 dark:bg-grid-white/[0.1] bg-grid-black/[0.1]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-black"></div>
        </>
      )}

      <div className="text-center">
        <h1 className="text-3xl font-display text-center text-foreground bg-secondary w-fit mx-auto p-2 rounded-lg ">
          {t('about:who')}
        </h1>
      </div>
      <div className="p-2 text-center justify-center items-center rounded-lg mb-4">
        <p className="text-xl text-foreground font-display">
          {t('about:introText')}
        </p>
      </div>

      {/* Carousel */}
      <div className="w-full">
        <Carousel setApi={setApi} increment={1} rotateTime={3} buttons={false}>
          <CarouselContent>
            {people.map((person, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center bg-secondary rounded-lg shadow-sm overflow-hidden w-[250px] mx-auto mb-1">
                  <img
                    src={person.src}
                    alt={person.name}
                    className="h-[250px] object-cover"
                  />
                  <div className="p-4 text-center">
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 hover:text-blue-600"
                    >
                      <FaLinkedin size={24} color="#0A66C2" />
                      <p className="text-xl font-display text-foreground">
                        {person.name}
                      </p>
                    </a>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {count > 0 && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: count }, (_, i) => {
            const slideIndex = i + 1;
            const isActive = slideIndex === current;

            return (
              <span
                key={slideIndex}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors duration-300 transform',
                  isActive ? 'bg-primary scale-110' : 'bg-gray-300'
                )}
              />
            );
          })}
        </div>
      )}

      {/* Read More Button */}
      {readMore && (
        <div className="text-center mt-8">
          <Link to="/about">
            <Button
              isInteractive
              className="mb-5 bg-primary p-4 text-2xl font-display text-white inline-flex items-center justify-center"
            >
              {t('homepage:readmore')}
              <MoveRight strokeWidth={4} />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
