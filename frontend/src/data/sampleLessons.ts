import { Lesson } from '../types';
import { SCERT_MATH_LESSONS } from './mathLessons';
import { SCERT_EVS_LESSONS } from './evsLessons';
import { SCERT_ENGLISH_LESSONS } from './englishLessons';

// Kerala SCERT Grade 4 Curriculum for VAAYANA (വായന): Mathematics, EVS & English
export const INITIAL_LESSONS: Lesson[] = [
  ...SCERT_MATH_LESSONS,
  ...SCERT_EVS_LESSONS,
  ...SCERT_ENGLISH_LESSONS
];

