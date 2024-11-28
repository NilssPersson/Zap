export * from './types/quiz';
export * from './types/slides';
export * from './types/questions';
export * from './types/participants';

// For backward compatibility
import type { Quiz } from './types/quiz';
export type { Quiz as default };
