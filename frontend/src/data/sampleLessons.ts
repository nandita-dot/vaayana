import { Lesson } from '../types';
import { SCERT_MATH_LESSONS } from './mathLessons';
import { SCERT_EVS_LESSONS } from './evsLessons';

// Kerala SCERT Grade 4 Curriculum for VAAYANA (വായന): Mathematics & Environmental Studies (EVS)
export const INITIAL_LESSONS: Lesson[] = [
  ...SCERT_MATH_LESSONS,
  ...SCERT_EVS_LESSONS
];
