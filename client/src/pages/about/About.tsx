import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';
import LinkedInPhone from '@/pages/home/LinkedInPhone';
import { FaBullseye, FaSignal } from 'react-icons/fa';
import { Meteors } from '@/components/ui/meteors';
import { StarsBackground } from '@/components/ui/stars-background';
import LinkedInComponent from '@/pages/home/LinkedInComponent';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-background text-foreground h-screen overflow-hidden">
      {/* LinkedIn Component */}
      <div className="w-full mb-4 block lg:hidden">
        <LinkedInPhone readMore={false} />
      </div>

      <div className="w-full hidden lg:block pt-20">
        <LinkedInComponent readMore={false} />
      </div>

      {/* Goals Section */}
      <div className="flex w-full p-6 max-w-4xl mx-auto">
        <div className="px-2 pt-1">
          <FaBullseye size={18} color="#fb923c" />
        </div>
        <div className="pr-4 w-full mb-4 text-foreground">
          <h3 className="text-xl font-display mb-1 font-bold">
            {t('about:goalsTitle')}
          </h3>
          <p className="text-md font-display">{t('about:goalsText')}</p>
        </div>
      </div>

      {/* Status Section */}
      <div className="flex w-full mb-4 p-6 max-w-4xl mx-auto">
        <div className="px-2 pt-1">
          <FaSignal size={18} color="#8b5cf6" />
        </div>
        <div className="pr-4 w-full mb-4 text-foreground">
          <h3 className="text-xl font-display mb-1 font-bold">
            {t('about:statusTitle')}
          </h3>
          <p className="text-md font-display">{t('about:statusText')}</p>
        </div>
      </div>

      {/* GitHub Link */}
      <div className="flex w-full items-center justify-center bottom-0 absolute">
        <div className="w-full relative h-32 overflow-hidden">
          {/* Static Content */}
          <a
            href="https://github.com/FKnorring/Zap"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 text-2xl font-display flex items-center justify-center gap-2 text-blue-400 hover:text-blue-600 transition relative z-10"
          >
            {t('about:github')}
            <Link size={20} />
          </a>

          {/* Meteors */}
          <StarsBackground />
          <Meteors number={10} />
        </div>
      </div>
    </div>
  );
}
