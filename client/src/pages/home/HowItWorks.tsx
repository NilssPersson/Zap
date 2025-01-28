import results from '@/assets/questionImages/results.png';
import editor from '@/assets/editorImages/editor.png';
import lobby from '@/assets/questionImages/lobby.png';
import { useTranslation } from 'react-i18next';

type Step = {
  id: number;
  titleKey: string;
  textKey: string;
  image: string;
  bgColor: string;
};

const steps: Step[] = [
  {
    id: 1,
    titleKey: 'homepage:stepTitles.0',
    textKey: 'homepage:stepText.0',
    image: editor,
    bgColor: 'bg-blue-200',
  },
  {
    id: 2,
    titleKey: 'homepage:stepTitles.1',
    textKey: 'homepage:stepText.1',
    image: lobby,
    bgColor: 'bg-violet-200',
  },
  {
    id: 3,
    titleKey: 'homepage:stepTitles.2',
    textKey: 'homepage:stepText.2',
    image: results,
    bgColor: 'bg-red-200',
  },
];

const StepCard = ({ step, reverse }: { step: Step; reverse: boolean }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`relative flex items-center justify-between space-x-24 rounded-lg p-8 transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${step.bgColor}`}
    >
      {!reverse && (
        <div className="flex-1 w-1/2">
          <img
            src={step.image}
            alt={`Step ${step.id}`}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
      <div className="flex-1 p-6 flex flex-col items-center justify-start">
        <div className="w-16 h-16 bg-primary text-white text-xl font-display rounded-full mb-4 flex items-center justify-center">
          {step.id}
        </div>
        <div className="bg-background rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-display">{t(step.titleKey)}</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-snug">
            {t(step.textKey)}
          </p>
        </div>
      </div>
      {reverse && (
        <div className="flex-1 w-1/2">
          <img
            src={step.image}
            alt={`Step ${step.id}`}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <div className="py-6 w-full">
      <h1 className="text-5xl font-display text-center text-foreground mb-6 bg-secondary w-fit mx-auto p-2 rounded-lg">
        {t('homepage:getStarted')}
      </h1>
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-16">
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} reverse={index % 2 === 0} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
