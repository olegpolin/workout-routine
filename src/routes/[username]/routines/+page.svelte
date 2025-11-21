<script lang="ts">
  import type { PageProps } from './$types';
  import ProfileCard from '$lib/components/profile-card.svelte';
  import WorkoutCard from '$lib/components/workout-card.svelte';

  let { data }: PageProps = $props();
</script>

<div class="flex flex-col items-center gap-8">
  <div class="flex flex-row items-center gap-8">
    <ProfileCard profile={data.userProfile} />
    <h1 class="text-2xl font-semibold">{data.numWorkoutRoutines} Workout {data.numWorkoutRoutines === 1 ? 'Routine' : 'Routines'}</h1>
  </div>

  <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each data.workoutRoutines as workoutRoutine}
      <WorkoutCard {...workoutRoutine} />
    {/each}
  </div>
</div>
