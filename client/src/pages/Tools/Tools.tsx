import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Team from './Team';
import SpinWheel from './SpinWheel/SpinWheel';
import RandomNumber from './RandomNumber';
import { ToolsProvider } from '@/contexts/Tools/context';

export default function Tools() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tool } = useParams();

  useEffect(() => {
    if (!tool) {
      navigate('/tools/team-generator');
    }
  }, [tool, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/tools/${value}`);
  };

  return (
    <div className="bg-background pt-20 overflow-y-auto h-screen">
      <ToolsProvider>
        <div className="flex flex-col mx-2 justify-center items-center">
          <Tabs
            value={tool}
            onValueChange={handleTabChange}
            className="w-full flex flex-col justify-center items-center"
          >
            <TabsList className="font-display">
              <TabsTrigger value="team-generator">
                {t('general:teamGenerator')}
              </TabsTrigger>
              <TabsTrigger value="spin-wheel">
                {t('general:spinWheel')}
              </TabsTrigger>
              <TabsTrigger value="random-number">
                {t('general:randomNumber')}
              </TabsTrigger>
            </TabsList>

            <div className="w-full">
              <TabsContent value="team-generator">
                <Team />
              </TabsContent>

              <TabsContent value="spin-wheel">
                <SpinWheel />
              </TabsContent>

              <TabsContent value="random-number">
                <RandomNumber />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ToolsProvider>
    </div>
  );
}
