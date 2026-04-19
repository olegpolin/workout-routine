import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase, safeGetSession } }) => {
  const { session } = await safeGetSession();

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .eq('username', params.username)
    .single();

  if (!userProfile) {
    error(404, 'Not Found');
  }

  const { data: workoutRoutine } = await supabase
    .from('workout_routines')
    .select()
    .eq('user_id', userProfile.id)
    .eq('slug', params.routine)
    .single();

  if (!workoutRoutine) {
    error(404, 'Not Found');
  }

  const { count: favoritesCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('routine_id', workoutRoutine.id);

  let isFavorited = false;
  if (session) {
    const { count: favoriteCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('routine_id', workoutRoutine.id);

    isFavorited = (favoriteCount ?? 0) > 0;
  }

  const { data: workoutDaysData } = await supabase
    .from('workout_days')
    .select(`
      id, 
      day_number, 
      day_focus, 
      notes,
      workout_exercises (
        id,
        name,
        sets,
        reps,
        weight,
        notes
      )
    `)
    .eq('workout_routine_id', workoutRoutine.id)
    .order('day_number', { ascending: true });

  return {
    userProfile,
    workoutRoutine,
    workoutDaysData,
    favoritesCount: favoritesCount ?? 0,
    isFavorited,
    isLoggedIn: Boolean(session),
  };
};

export const actions: Actions = {
  favorite: async ({ params, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) {
      error(401, 'Unauthorized');
    }

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', params.username)
      .single();

    if (!userProfile) {
      error(404, 'Not Found');
    }

    const { data: workoutRoutine } = await supabase
      .from('workout_routines')
      .select('id')
      .eq('user_id', userProfile.id)
      .eq('slug', params.routine)
      .single();

    if (!workoutRoutine) {
      error(404, 'Not Found');
    }

    const { error: favoriteError } = await supabase
      .from('favorites')
      .upsert(
        {
          user_id: session.user.id,
          routine_id: workoutRoutine.id,
        },
        { onConflict: 'user_id,routine_id' },
      );

    if (favoriteError) {
      error(500, 'Unable to favorite this workout routine');
    }
  },

  unfavorite: async ({ params, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) {
      error(401, 'Unauthorized');
    }

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', params.username)
      .single();

    if (!userProfile) {
      error(404, 'Not Found');
    }

    const { data: workoutRoutine } = await supabase
      .from('workout_routines')
      .select('id')
      .eq('user_id', userProfile.id)
      .eq('slug', params.routine)
      .single();

    if (!workoutRoutine) {
      error(404, 'Not Found');
    }

    const { error: unfavoriteError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('routine_id', workoutRoutine.id);

    if (unfavoriteError) {
      error(500, 'Unable to remove favorite from this workout routine');
    }
  },
};
