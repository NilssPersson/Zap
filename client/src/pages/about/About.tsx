import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';
import LinkedInPhone from '@/pages/home/LinkedInPhone';
import { FaBullseye, FaCalendar, FaSignal } from 'react-icons/fa';
import { Meteors } from '@/components/ui/meteors';
import { StarsBackground } from '@/components/ui/stars-background';
import LinkedInComponent from '@/pages/home/LinkedInComponent';
import { useTheme } from '@/components/ThemeProvider';

const points = [
  {
    title: 'about:goalsTitle',
    text: 'about:goalsText',
    icon: FaBullseye,
    color: '#fb923c',
  },
  {
    title: 'about:statusTitle',
    text: 'about:statusText',
    icon: FaSignal,
    color: '#8b5cf6',
  },
  {
    title: 'about:futureTitle',
    text: 'about:futureText',
    icon: FaCalendar,
    color: '#65a30d',
  },
];

export default function AboutPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="flex flex-col bg-background text-foreground h-screen overflow-y-auto">
      {/* LinkedIn Component */}
      <div className="w-full mb-4 block lg:hidden">
        <LinkedInPhone readMore={false} />
      </div>

      <div className="w-full hidden lg:block pt-20">
        <LinkedInComponent readMore={false} />
      </div>

      {/* Points */}
      {points.map((point) => (
        <div className="flex w-full px-8 py-6 max-w-4xl mx-auto">
          <div className="px-2 pt-1">
            <point.icon size={18} color={point.color} />
          </div>
          <div className="pr-4 w-full text-foreground">
            <h3 className="text-xl font-display">{t(point.title)}</h3>
            <p className="text-md font-display">{t(point.text)}</p>
          </div>
        </div>
      ))}

      {/* Transition to dark */}
      {theme === 'light' && (
        <div className="flex w-full items-center justify-center pt-6 bg-gradient-to-b from-transparent to-black" />
      )}

      {/* GitHub Link */}
      <div className="flex w-full items-center justify-center pt-4 bg-black">
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
