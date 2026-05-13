<script lang="ts">
  import type { PageProps } from './$types';
  import Seo from '$lib/components/seo.svelte';
  import WorkoutForm from './workout-form.svelte';

  let { data }: PageProps = $props();
</script>

<Seo title={`Edit ${data.workoutForm.data.name}`} />

<div class="my-4 flex w-full max-w-360 flex-col gap-8 sm:my-8 sm:px-6 mx-auto">
  <div class="flex flex-col gap-3 rounded-4xl border border-border bg-card p-5 text-left shadow-[7px_7px_0_0_var(--hard-shadow)] sm:p-8">
    <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Routine studio</p>
    <h1 class="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
      Tune the workout plan
    </h1>
    <p class="max-w-2xl text-base font-semibold leading-7 text-muted-foreground sm:text-lg">Edit training days, exercises, sets, reps, and load with a calmer builder made for real gym notes.</p>
  </div>

  <div class="w-full flex justify-center">
    <WorkoutForm {data} />
  </div>
</div>
