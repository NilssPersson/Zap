import nils from '@/assets/photos/nils.jpeg';
import ramez from '@/assets/photos/ramez.jpeg';
import lisa from '@/assets/photos/lisa.jpeg';
import jacob from '@/assets/photos/jacob.jpeg';
import filip from '@/assets/photos/filip.jpeg';

import { FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';

interface LinkedInComponentProps {
  readMore: boolean;
}

const teamMembers = [
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

function LinkedInComponent({ readMore }: LinkedInComponentProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center max-w-7xl mx-auto p-4">
      <div className="text-center">
        <h1 className="text-5xl font-display text-center text-foreground bg-secondary w-fit mx-auto p-2 rounded-lg">
          {t('about:who')}
        </h1>
      </div>
      <div className="p-2 text-center justify-center items-center rounded-lg mb-4">
        <p className="text-xl text-foreground font-display max-w-3xl mx-auto">
          {t('about:introText')}
        </p>
      </div>
      <div className="flex-1 p-6 rounded-lg bg-background ">
        <div className="flex flex-row gap-6 justify-center items-center w-full lg:flex md:grid md:grid-cols-3 md:gap-4 md:px-4">
          {teamMembers.map((person, index) => (
            <a
              key={index}
              className="
        group
        hover:scale-y-105 
        hover:scale-x-105 
        flex 
        flex-col 
        items-center
        justify-center
        text-center 
        gap-4
        bg-secondary
        rounded-lg 
        shadow-md 
        w-[220px] 
        h-[240px] 
        max-w-[240px] 
        transition 
        duration-300 
        ease-in-out
      "
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={person.src}
                alt={person.name}
                className="w-32 h-32 rounded-full shadow object-cover mx-auto"
              />
              <div className="flex flex-col justify-between items-center">
                <div className="flex flex-row justify-between space-x-2 items-center">
                  <FaLinkedin size={32} color="#0A66C2" />
                  <p className="text-xl font-medium font-display group-hover:text-blue-500">
                    {person.name}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {readMore && (
          <div className="text-center mt-8">
            <Link to="/about">
              <Button
                variant={location.pathname === '/about' ? 'default' : 'ghost'}
                className="bg-primary text-2xl font-display text-black"
              >
                {t('homepage:readmore')}
                <MoveRight strokeWidth={3} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default LinkedInComponent;
