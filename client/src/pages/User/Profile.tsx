import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowBigRight, ArrowBigLeft } from 'lucide-react';
import { useAppContext } from '@/contexts/App/context';
import { useTranslation } from 'react-i18next';

import { avatarCollections, collectionNames } from '@/utils'; // Import the collections and names
import Avatar, { findCollectionIndexByName } from '@/Avatar'; // Import the Avatar component

function Profile() {
  const {
    user: { user, updateUser },
  } = useAppContext();
  const { t } = useTranslation();
  const [avatarString, setAvatarString] = useState(user?.avatar || '');
  const [avatarStrings, setAvatarStrings] = useState<string[]>(
    user?.avatar ? [user.avatar] : []
  );
  const [username, setUsername] = useState(user?.username || '');
  const [avatarIndex, setAvatarIndex] = useState(0); // To keep track of the current avatar index
  const [collectionIndex, setCollectionIndex] = useState(0);

  useEffect(() => {
    if (!user) return;
    setAvatarString(user.avatar || '');

    setUsername(user.username || '');

    const index = findCollectionIndexByName(user.collectionName);
    if (index !== null) {
      setCollectionIndex(index);
    }
  }, [user]);

  // Function to generate a random avatar ID
  const makeid = (length: number): string => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Right Arrow Click (Next Avatar)
  const rightAvatarChange = () => {
    if (avatarIndex < avatarStrings.length - 1) {
      // Move to the next avatar if within bounds
      setAvatarIndex(avatarIndex + 1);
    } else {
      // If the index goes out of bounds, create a new avatar ID and add it to the list
      const newId = makeid(10);
      setAvatarStrings((prev) => [...prev, newId]);
      setAvatarIndex((prev) => prev + 1); // Set the index to the new avatar
    }
  };

  // Left Arrow Click (Previous Avatar)
  const leftAvatarChange = () => {
    if (avatarIndex > 0) {
      // Move to the previous avatar if within bounds
      setAvatarIndex(avatarIndex - 1);
    } else {
      // If the index goes below 0, return to the first avatar instead of generating a new one
      console.warn('You are at the first avatar.');
    }
  };

  // Initialize the avatarStrings array and avatarIndex on load
  useEffect(() => {
    if (user?.avatar) {
      setAvatarStrings([user.avatar]); // Ensure the user's avatar is the initial value
      setAvatarIndex(0); // Start at the first index
    }
  }, [user]);

  // Update the avatar string based on the current index
  const currentAvatarString = avatarStrings[avatarIndex];

  const handleUpdate = async () => {
    if (!user || !user.id) return;

    const updatedUser = {
      ...user,
      username,
      avatar: avatarString,
      collectionName: collectionNames[collectionIndex], // Store the name of the collection in the DB
    };

    try {
      await updateUser(updatedUser);

      toast.success('Profile updated!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Something went wrong');
    }
  };

  // Navigate forward in the collections list
  const goToNextCollection = () => {
    setCollectionIndex(
      (prevIndex) => (prevIndex + 1) % avatarCollections.length
    );
  };

  // Navigate backward in the collections list
  const goToPreviousCollection = () => {
    setCollectionIndex((prevIndex) => {
      const totalCollections = avatarCollections.length;
      return (prevIndex - 1 + totalCollections) % totalCollections; // Handles negative indices
    });
  };

  // Get the currently selected collection style

  const selectedCollectionName = collectionNames[collectionIndex];

  return (
    <div className="rounded-lg flex-1 w-full flex-col flex items-center justify-center overflow-hidden">
      <Card className="bg-[#FBF6E9] mb-10">
        <CardContent className="flex flex-col items-center gap-4 py-6">
          {/* Use the Avatar component */}
          <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
            <ArrowBigLeft
              fill="gray"
              size={'48'}
              onClick={leftAvatarChange}
              className="mx-5 cursor-pointer"
            ></ArrowBigLeft>
            <Avatar
              avatarString={currentAvatarString}
              collectionName={selectedCollectionName}
            />
            <ArrowBigRight
              fill="gray"
              size={'48'}
              onClick={rightAvatarChange}
              className="mx-5 cursor-pointer"
            ></ArrowBigRight>
          </div>

          <div className="flex-1 w-full flex-col flex items-center justify-center">
            <div className="flex-1 w-full flex items-center justify-center">
              <ArrowBigLeft
                fill="gray"
                size={'48'}
                onClick={goToPreviousCollection}
                className="mx-5 cursor-pointer"
              ></ArrowBigLeft>
              <h1 className="font-display select-none">
                {t('homepage:collection')}!
              </h1>

              <ArrowBigRight
                fill="gray"
                size={'48'}
                onClick={goToNextCollection}
                className="mx-5 cursor-pointer"
              ></ArrowBigRight>
            </div>
          </div>

          <Input
            placeholder={t('general:username')}
            className="text-[#333333] text-center w-100 border-gray-400 rounded-md font-display text-lg md:text-lg py-4 px-6  shadow-lg"
            value={username}
            maxLength={15}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Button onClick={handleUpdate} className="bg-green-500">
            {t('general:update')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
