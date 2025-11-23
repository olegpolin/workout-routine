<script lang="ts">
  import type { PageProps } from './$types';
  import WorkoutCard from '$lib/components/workout-card.svelte';

  let { data }: PageProps = $props();
</script>

<div class="flex flex-col items-center gap-16 my-8">
  <div class="flex flex-col items-center gap-4">
    <h1 class="text-4xl text-center font-bold">
      Discover Your Next
      <span class="text-blue-500">Workout Routine</span>
    </h1>
    <p class="text-lg text-center text-muted-foreground">
      Browse community-created workout routines and start your fitness journey today
    </p>
  </div>

  <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each data.workoutRoutines as workoutRoutine}
      <WorkoutCard {...workoutRoutine} />
    {/each}
  </div>
</div>
