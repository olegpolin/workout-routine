import type { PageServerLoad } from './$types';
import { getPreviews, getSearchMatchedRoutineIds } from '$lib/server/workout-routines';
import { isWorkoutDifficulty, isWorkoutType } from '$lib/constants';

const PAGE_SIZE = 12;

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  const pageParam = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const offset = (page - 1) * PAGE_SIZE;

  const workoutTypeParam = url.searchParams.get('type');
  const workoutDifficultyParam = url.searchParams.get('difficulty');
  const searchParam = url.searchParams.get('search')?.trim() ?? '';
  const followingParam = url.searchParams.get('following');
  const search = searchParam.length > 0 ? searchParam : null;
  const followingOnly = followingParam === 'true';

  const workoutType = workoutTypeParam && isWorkoutType(workoutTypeParam)
    ? workoutTypeParam
    : null;
  const workoutDifficulty = workoutDifficultyParam && isWorkoutDifficulty(workoutDifficultyParam)
    ? workoutDifficultyParam
    : null;

  let followingUserIds: string[] | null = null;
  if (followingOnly) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        workoutRoutines: [],
        page,
        pageSize: PAGE_SIZE,
        totalWorkoutRoutines: 0,
        workoutType,
        workoutDifficulty,
        search,
        followingOnly,
        hasNextPage: false,
        hasPreviousPage: page > 1,
      };
    }

    const { data: followingRows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', session.user.id);

    followingUserIds = [...new Set((followingRows ?? []).map((row) => row.following_id))];

    if (followingUserIds.length === 0) {
      return {
        workoutRoutines: [],
        page,
        pageSize: PAGE_SIZE,
        totalWorkoutRoutines: 0,
        workoutType,
        workoutDifficulty,
        search,
        followingOnly,
        hasNextPage: false,
        hasPreviousPage: page > 1,
      };
    }
  }

  const searchMatchedRoutineIds = search
    ? await getSearchMatchedRoutineIds(supabase, search)
    : null;

  if (searchMatchedRoutineIds?.length === 0) {
    return {
      workoutRoutines: [],
      page,
      pageSize: PAGE_SIZE,
      totalWorkoutRoutines: 0,
      workoutType,
      workoutDifficulty,
      search,
      followingOnly,
      hasNextPage: false,
      hasPreviousPage: page > 1,
    };
  }

  let workoutRoutinesCountQuery = supabase
    .from('workout_routines')
    .select('id', { count: 'exact', head: true });

  if (workoutType) {
    workoutRoutinesCountQuery = workoutRoutinesCountQuery.eq('workout_type', workoutType);
  }

  if (workoutDifficulty) {
    workoutRoutinesCountQuery = workoutRoutinesCountQuery.eq('workout_difficulty', workoutDifficulty);
  }

  if (searchMatchedRoutineIds && searchMatchedRoutineIds.length > 0) {
    workoutRoutinesCountQuery = workoutRoutinesCountQuery.in('id', searchMatchedRoutineIds);
  }

  if (followingUserIds && followingUserIds.length > 0) {
    workoutRoutinesCountQuery = workoutRoutinesCountQuery.in('user_id', followingUserIds);
  }

  const [{ count: totalWorkoutRoutines }, workoutRoutinesWithProbe] = await Promise.all([
    workoutRoutinesCountQuery,
    getPreviews(supabase, {
      workout_type: workoutType ?? undefined,
      workout_difficulty: workoutDifficulty ?? undefined,
      routine_ids: searchMatchedRoutineIds ?? undefined,
      user_ids: followingUserIds ?? undefined,
      limit: PAGE_SIZE + 1,
      offset,
    }),
  ]);

  const hasNextPage = workoutRoutinesWithProbe.length > PAGE_SIZE;
  const workoutRoutines = hasNextPage
    ? workoutRoutinesWithProbe.slice(0, PAGE_SIZE)
    : workoutRoutinesWithProbe;

  return {
    workoutRoutines,
    page,
    pageSize: PAGE_SIZE,
    totalWorkoutRoutines: totalWorkoutRoutines ?? 0,
    workoutType,
    workoutDifficulty,
    search,
    followingOnly,
    hasNextPage,
    hasPreviousPage: page > 1,
  };
};
