import { Button } from '@/components/ui/button';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import QuestionCarousel from '@/pages/home/QuestionCarousel';
import AvatarCarousel from './AvatarCarousel';
import { useTranslation } from 'react-i18next';
import HowItWorks from './HowItWorks';
import HowItWorksPhone from './HowItWorksPhone';
import { Card, CardContent } from '@/components/ui/card';
import LinkedInComponent from './LinkedInComponent';
import LinkedInPhone from './LinkedInPhone';
import { Footer } from '@/components/Footer';

interface AvatarData {
  avatarString: string;
  collectionName: string;
}

const generateRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const randomStrings = Array.from({ length: 25 }, () =>
  generateRandomString(30)
);

const collectionNames = [
  'botttsNeutral',
  'thumbs',
  'micah',
  'adventurerNeutral',
];

// Generate random avatar data by iterating through collection names
const generateRandomAvatarData = (): AvatarData[] => {
  const avatarData: AvatarData[] = [];

  for (const randomString of randomStrings) {
    for (const collectionName of collectionNames) {
      avatarData.push({
        avatarString: randomString,
        collectionName: collectionName,
      });
    }
  }

  return avatarData;
};

const avatarData = generateRandomAvatarData();

function Home() {
  const { register } = useKindeAuth();

  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-auto overflow-x-hidden h-screen w-full bg-background">
      <div className="flex-1 flex flex-col items-center justify-start w-full">
        <div className="flex-1 w-full py-4 bg-primary items-center justify-center flex flex-col">
          <div className="mt-20 mb-2 flex flex-col gap-y-3 mx-auto items-center justify-center">
            <h1 className="w-4/5 lg:w-1/2 text-4xl md:text-5xl font-display text-foreground mx-4 text-center">
              {t('homepage:slogan')}
            </h1>

            <h3 className="text-foreground w-4/5 lg:w-1/2 text-lg mx-4 leading-snug text-center">
              {t('homepage:inspotext')}
            </h3>
          </div>
          <Button
            className="w-full mt-10 font-display lg:text-3xl text-xl bg-green-500 border-2 border-green-500 text-white hover:bg-white hover:text-black hover:border-black hover:border-2 mb-16"
            size="lg"
            isInteractive
            interactiveStyles="w-fit"
            onClick={() => register()}
          >
            {t('general:register')}
          </Button>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="rotate-180 scale-x-[-1] -mt-1"
        >
          <path
            fill="#fbaf3c"
            fill-opacity="1"
            d="M0,128L48,133.3C96,139,192,149,288,138.7C384,128,480,96,576,74.7C672,53,768,43,864,58.7C960,75,1056,117,1152,154.7C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>

        {/* Container for Title and Carousel */}
        <div className="flex-1 w-full mt-6">
          <QuestionCarousel />
        </div>

        <div className="w-full">
          {/* Render HowItWorks for larger devices */}
          <div className="hidden lg:block">
            <HowItWorks />
          </div>
          {/* Render HowItWorksPhone for smaller devices */}
          <div className="block lg:hidden">
            <HowItWorksPhone />
          </div>
        </div>

        <div className="w-full overflow-x-auto hidden lg:block my-8">
          <LinkedInComponent readMore={true} />
        </div>

        <div className="w-full block lg:hidden">
          <LinkedInPhone readMore={true} />
        </div>

        <div>
          <AvatarCarousel avatars={avatarData}></AvatarCarousel>
        </div>
        {/* Avatar Carousel */}
      </div>

      <div className="flex flex-col items-center w-full py-10 bg-primary">
        <h1 className="text-foreground font-display text-3xl text-center">
          Try out our templates!
        </h1>
        <div className="w-full max-w-7xl mt-8 p-2">
          <Card className="bg-card shadow-lg px-5">
            <CardContent className="min-h-[200px] flex items-center justify-center">
              {/* Add content here */}
              <p className=" text-2xl text-gray-700 font-display">
                No templates available yet!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
