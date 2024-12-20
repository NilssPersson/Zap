import { Button } from '@/components/ui/button';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { WiggleText } from '@/components/WiggleText';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import bombpicture from '../utils/images/bombpicture.png';
import fff from '../utils/images/fff.png';
import rankitright from '../utils/images/rankitright.png';
import locateit from '../utils/images/locateit.png';
import Avatar from '@/Avatar';
import { Separator } from '@/components/ui/separator';

interface AvatarData {
  avatarString: string;
  collectionName: string;
}

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

// Generate 50 random strings of length 10
const randomStrings = Array.from({ length: 50 }, () =>
  generateRandomString(15)
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

  for (let i = 0; i < 50; i++) {
    const randomString = randomStrings[i];
    const collectionIndex = i % collectionNames.length; // This will iterate through the 4 collections
    const randomCollection = collectionNames[collectionIndex];

    avatarData.push({
      avatarString: randomString,
      collectionName: randomCollection,
    });
  }

  return avatarData;
};

const avatarData = generateRandomAvatarData();
console.log(avatarData); // Output the generated avatar data

function Home() {
  const { login, register } = useKindeAuth();
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate('/play');
  };

  const images = [bombpicture, locateit, fff, rankitright];
  const titles: string[] = [
    'Ticking Time Bomb',
    'Locate It',
    'Fastest Finger First',
    'Match It Right',
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-start mt-10 overflow-y-scroll">
      {/* "Zap!" text */}
      <WiggleText
        text="Zap!"
        className="text-9xl font-bold font-display fancy-wrap mb-10 mt-10"
      />
      <div className="flex-1 flex flex-row items-center justify-center space-x-40 mt-10">
        <div className="flex-1 flex flex-col items-center justify-center gap-12 ">
          <Button
            className="font-display text-7xl outline outline-3 p-16 bg-green-500 text-white hover:bg-white hover:text-black"
            size="lg"
            onClick={handlePlay}
          >
            Play Now
          </Button>
          <div className="flex-1 flex flex-row items-center justify-center space-x-4">
            <Button
              className="font-display text-5xl outline outline-3 p-8"
              size="lg"
              onClick={() => login()}
            >
              Sign In
            </Button>

            <Button
              className="font-display text-5xl outline outline-3 p-8"
              size="lg"
              onClick={() => register()}
            >
              Sign up
            </Button>
          </div>
        </div>

        {/* Container for Title and Carousel */}
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl font-display mb-4">
            Explore 20 different question types!
          </h1>

          <div className="text-center flex max-w-4xl items-center justify-center w-[400px]">
            {/* Control carousel's width */}
            <Carousel increment={1} rotateTime={5} buttons={false}>
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem className="border-white" key={index}>
                    {/* Container for Title and Image */}
                    <div className="p-2">
                      {/* Title above the image */}
                      <h2 className="text-3xl font-display mb-2">
                        {titles[index]}
                      </h2>
                      <div className="rounded-lg border-4 border-white overflow-hidden">
                        <img src={image} alt={`Slide ${index + 1}`} />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>

      <Separator className="mt-10 mb-10" />

      <div>
        <h1 className="font-display text-5xl">
          Register to choose from over 100 different avatars!
        </h1>
        <div className="mt-10 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <Carousel increment={1} buttons={true}>
              <CarouselContent>
                {avatarData.map((avatar, index) => (
                  <CarouselItem
                    key={avatar.avatarString}
                    className="flex justify-center items-center p-4"
                  >
                    <div className="flex space-x-16">
                      {/* Display 3 different avatars in a row */}
                      <div className="flex flex-col items-center">
                        <Avatar
                          avatarString={avatar?.avatarString || ''}
                          collectionName={avatar?.collectionName || ''}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        {/* Render a different avatar for this item */}
                        <Avatar
                          avatarString={
                            avatarData[(3 * index + 1) % avatarData.length]
                              ?.avatarString || ''
                          }
                          collectionName={
                            avatarData[(3 * index + 1) % avatarData.length]
                              ?.collectionName || ''
                          }
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        {/* Render another different avatar */}
                        <Avatar
                          avatarString={
                            avatarData[(3 * index + 2) % avatarData.length]
                              ?.avatarString || ''
                          }
                          collectionName={
                            avatarData[(3 * index + 2) % avatarData.length]
                              ?.collectionName || ''
                          }
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        {/* Render another different avatar */}
                        <Avatar
                          avatarString={
                            avatarData[(3 * index + 3) % avatarData.length]
                              ?.avatarString || ''
                          }
                          collectionName={
                            avatarData[(3 * index + 3) % avatarData.length]
                              ?.collectionName || ''
                          }
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        {/* Render another different avatar */}
                        <Avatar
                          avatarString={
                            avatarData[(3 * index + 4) % avatarData.length]
                              ?.avatarString || ''
                          }
                          collectionName={
                            avatarData[(3 * index + 4) % avatarData.length]
                              ?.collectionName || ''
                          }
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
