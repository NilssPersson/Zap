import { getFirebaseServices } from '@/firebase';

function SomeComponent() {
  const { database } = getFirebaseServices();
  // Use database...
} 