import type { PageServerLoad } from './$types';
import { getPreviews } from '$lib/server/workout-routines';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const workoutRoutines = await getPreviews(supabase);
  return { workoutRoutines };
};
