export const WORKOUT_TYPES = ['strength', 'cardio', 'flexibility', 'calisthenics', 'other'] as const;
export const WORKOUT_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'other'] as const;

export type WorkoutType = (typeof WORKOUT_TYPES)[number];
export type WorkoutDifficulty = (typeof WORKOUT_DIFFICULTIES)[number];

export const WORKOUT_TYPE_OPTIONS: ReadonlyArray<{ value: WorkoutType; label: string }> = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'calisthenics', label: 'Calisthenics' },
  { value: 'other', label: 'Other' },
];

export const WORKOUT_DIFFICULTY_OPTIONS: ReadonlyArray<{ value: WorkoutDifficulty; label: string }> = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'other', label: 'Other' },
];

export const WORKOUT_TYPE_FILTER_OPTIONS: ReadonlyArray<{ value: WorkoutType | null; label: string }> = [
  { value: null, label: 'All' },
  ...WORKOUT_TYPE_OPTIONS,
];

export const WORKOUT_DIFFICULTY_FILTER_OPTIONS: ReadonlyArray<{ value: WorkoutDifficulty | null; label: string }> = [
  { value: null, label: 'All' },
  ...WORKOUT_DIFFICULTY_OPTIONS,
];

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isWorkoutType = (value: string): value is WorkoutType => WORKOUT_TYPES.includes(value as WorkoutType);

export const isWorkoutDifficulty = (value: string): value is WorkoutDifficulty =>
  WORKOUT_DIFFICULTIES.includes(value as WorkoutDifficulty);
