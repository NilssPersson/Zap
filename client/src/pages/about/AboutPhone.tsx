import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';
import LinkedInPhone from '@/pages/home/LinkedInPhone';
import { FaBullseye, FaSignal } from 'react-icons/fa';

export default function AboutPhone() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-background text-black h-screen overflow-auto">
      <div className="w-full mb-4">
        <LinkedInPhone readMore={false} />
      </div>

      {/* Goals Section */}
      <div className="flex w-full mb-4 p-2">
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
      <div className="flex w-full mb-4 p-2">
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
      <div className="text-center w-full mt-6">
        <a
          href="https://github.com/FKnorring/Zap"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl pb-6 font-display flex items-center justify-center gap-2 text-blue-400 hover:text-blue-600 transition"
        >
          {t('about:github')}
          <Link size={20} />
        </a>
      </div>
    </div>
  );
}
