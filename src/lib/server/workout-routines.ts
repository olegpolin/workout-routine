import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkoutRoutineCardProps, DayPreview } from '$lib/components/workout-card.svelte';

type Filters = {
  user_id?: string;
}

export async function getPreviews(supabase: SupabaseClient, filters?: Filters): Promise<WorkoutRoutineCardProps[]> {
  let workoutRoutinesData;
  if (!filters?.user_id) {
    const { data: workoutRoutinesDataToAdd } = await supabase
      .from('workout_routines')
      .select('id, user_id, name, slug, uses_numbered_days')
      .limit(20);
    workoutRoutinesData = workoutRoutinesDataToAdd;
  } else {
    const { data: workoutRoutinesDataToAdd } = await supabase
      .from('workout_routines')
      .select('id, user_id, name, slug, uses_numbered_days')
      .eq('user_id', filters.user_id)
      .limit(20);
    workoutRoutinesData = workoutRoutinesDataToAdd;
  }

  if (!workoutRoutinesData) {
    return [];
  }

  let workoutRoutines: WorkoutRoutineCardProps[] = [];

  for (let i = 0; i < workoutRoutinesData.length; i++) {
    const name = workoutRoutinesData[i].name;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', workoutRoutinesData[i].user_id)
      .single();
    const href = `/${profileData?.username ?? 'unknown'}/routines/${workoutRoutinesData[i].slug}`;

    const usesNumberedDays = workoutRoutinesData[i].uses_numbered_days;

    let daysPreview: DayPreview[] = [];
    const { data: workoutDaysData } = await supabase
      .from('workout_days')
      .select('id, day_number, day_label')
      .eq('workout_routine_id', workoutRoutinesData[i].id)
      .order('day_number', { ascending: true })
      .limit(3);
    if (!workoutDaysData) {
      continue;
    }
    let totalExercises = 0;
    for (let j = 0; j < workoutDaysData.length; j++) {
      const { data: workoutExercisesData } = await supabase
        .from('workout_exercises')
        .select('id')
        .eq('workout_day_id', workoutDaysData[j].id);
      const numExercises = workoutExercisesData ? workoutExercisesData.length : 0;
      daysPreview.push({
        dayLabel: workoutDaysData[j].day_label,
        numExercises,
      });
      totalExercises += numExercises;
    }

    workoutRoutines.push({
      name,
      href,
      usesNumberedDays,
      daysPreview,
      totalExercises,
    });
  }

  return workoutRoutines;
}
