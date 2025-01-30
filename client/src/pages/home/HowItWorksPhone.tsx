import editor from '@/assets/editorImages/editor.png';
import lobby from '@/assets/questionImages/lobby.png';
import results from '@/assets/questionImages/results.png';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface StepData {
  id: number;
  image: string;
  titleKey: string;
  textKey: string;
  bgColor: string;
}

const stepsData: StepData[] = [
  {
    id: 1,
    image: editor,
    titleKey: 'homepage:stepTitles.0',
    textKey: 'homepage:stepText.0',
    bgColor: 'bg-blue-200',
  },
  {
    id: 2,
    image: lobby,
    titleKey: 'homepage:stepTitles.1',
    textKey: 'homepage:stepText.1',
    bgColor: 'bg-violet-200',
  },
  {
    id: 3,
    image: results,
    titleKey: 'homepage:stepTitles.2',
    textKey: 'homepage:stepText.2',
    bgColor: 'bg-red-100',
  },
];

const Step = ({
  step,
  t,
  direction,
}: {
  step: StepData;
  t: (key: string) => string;
  direction: 'left' | 'right';
}) => {
  const animationVariants = {
    hidden: { opacity: 0, x: direction === 'left' ? -150 : 150 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      className={`${step.bgColor} rounded-lg p-6 shadow-md flex flex-col items-center`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={animationVariants}
    >
      <div className="w-12 h-12 bg-primary text-white text-lg font-bold rounded-full flex items-center justify-center mb-4">
        {step.id}
      </div>
      <img
        src={step.image}
        alt={`Step ${step.id}`}
        className="w-full h-auto rounded-lg shadow-md"
      />
      <div className="rounded-lg p-1">
        <h2 className="text-xl font-display text-gray-900 mb-1">
          {t(step.titleKey)}
        </h2>
        <p className="text-gray-700 text-sm leading-snug">{t(step.textKey)}</p>
      </div>
    </motion.div>
  );
};

export default function HowItWorksPhone() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-background pb-2">
      <h1 className="text-3xl font-display text-center text-foreground mb-6 bg-secondary w-fit mx-auto p-2 rounded-lg">
        {t('homepage:getStarted')}
      </h1>
      <div className="space-y-16 max-w-md mx-auto px-4">
        {stepsData.map((step, index) => (
          <Step
            key={step.id}
            step={step}
            t={t}
            direction={index % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </div>
  );
}
