<script lang="ts">
  import type { PageProps } from './$types';
  import WorkoutForm from './workout-form.svelte';

  let { data }: PageProps = $props();
</script>

<div class="flex flex-col items-center gap-12 my-8 w-full max-w-4xl mx-auto">
  <div class="flex flex-col items-center gap-2">
    <h1 class="text-4xl sm:text-5xl text-center font-bold tracking-tight text-foreground mb-2">
      Edit Your <span class="text-primary">Workout</span> Plan
    </h1>
    <p class="text-lg text-center text-muted-foreground font-medium">Design a custom workout schedule with exercises for each day</p>
  </div>

  <div class="w-full flex justify-center">
    <WorkoutForm {data} />
  </div>
</div>
