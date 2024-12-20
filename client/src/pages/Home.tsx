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

function Home() {
  const { login, register } = useKindeAuth();
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate('/play');
  };

  const images = [
    'https://via.placeholder.com/300x200?text=Image+1',
    'https://via.placeholder.com/300x200?text=Image+2',
    'https://via.placeholder.com/300x200?text=Image+3',
    'https://via.placeholder.com/300x200?text=Image+4',
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <WiggleText
        text="Zap!"
        className="text-7xl font-bold font-display mb-16 fancy-wrap"
      />
      <div className="flex flex-row gap-4">
        <Button
          className="font-display text-3xl outline outline-3"
          size="lg"
          onClick={handlePlay}
        >
          Play
        </Button>
        <Button
          className="font-display text-3xl outline outline-3"
          size="lg"
          onClick={() => login()}
        >
          Login
        </Button>
        <Button
          className="font-display text-3xl outline outline-3"
          size="lg"
          onClick={() => register()}
        >
          Register
        </Button>
      </div>
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Explore 20 different question types!
        </h1>
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

export default Home;
