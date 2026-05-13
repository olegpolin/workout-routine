<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { PageProps } from './$types';
  import Seo from '$lib/components/seo.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Spinner } from '$lib/components/ui/spinner';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Table from '$lib/components/ui/table';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import { toast } from 'svelte-sonner';
  import ProfileCard from '$lib/components/profile-card.svelte';
  import { WEEKDAYS } from '$lib/constants';
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
  import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
  import Clock3Icon from '@lucide/svelte/icons/clock-3';
  import PencilIcon from '@lucide/svelte/icons/pencil';
  import HeartIcon from '@lucide/svelte/icons/heart';
  import Share2Icon from '@lucide/svelte/icons/share-2';
  import VideoIcon from '@lucide/svelte/icons/video';
  import ZapIcon from '@lucide/svelte/icons/zap';

  type DemoSearchActionResult = {
    exerciseName?: string;
    videoUrl?: string | null;
    error?: string | null;
  };

  let { data, form }: PageProps = $props();
  let isFavoritePending = $state(false);
  let isDemoSearchPending = $state(false);
  let exerciseDemoDialogOpen = $state(false);
  let selectedExerciseName = $state<string | null>(null);
  let demoSearchForm: HTMLFormElement | null = $state(null);
  let demoSearchOpenNonce = $state(0);
  let lastAutoSearchOpenNonce = $state(-1);

  const weekdays = WEEKDAYS;

  const getDayTitle = (dayNumber: number) => {
    if (data.workoutRoutine.uses_numbered_days) {
      return `Day ${dayNumber}`;
    }

    return weekdays[dayNumber - 1] ?? `Day ${dayNumber}`;
  };

  const shareWorkout = (e: MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatEnumLabel = (value: string | null | undefined) => {
    if (!value) {
      return 'Not set';
    }

    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  };

  const workoutDaysCount = $derived(data.workoutDaysData?.filter(d => (d.workout_exercises?.length ?? 0) > 0).length ?? 0);
  const restDaysCount = $derived((data.workoutDaysData?.length ?? 0) - workoutDaysCount);
  const totalExercises = $derived(data.workoutDaysData?.reduce((acc, current) => acc + (current.workout_exercises?.length ?? 0), 0) ?? 0);

  // Assuming roughly 12 minutes per exercise for average duration calculation
  const AVG_MIN_PER_EXERCISE = 12;
  const avgDurationPerWorkoutDay = $derived(workoutDaysCount > 0 ? Math.round((totalExercises * AVG_MIN_PER_EXERCISE) / workoutDaysCount) : 0);

  const enhanceFavorite = () => {
    isFavoritePending = true;

    return async ({ update }: { update: () => Promise<void> }) => {
      try {
        await update();
      } finally {
        isFavoritePending = false;
      }
    };
  };

  const enhanceDemoSearch: SubmitFunction = () => {
    isDemoSearchPending = true;

    return async ({ update }) => {
      try {
        await update();
      } finally {
        isDemoSearchPending = false;
      }
    };
  };

  const openExerciseDemoDialog = (exerciseName: string) => {
    selectedExerciseName = exerciseName;
    demoSearchOpenNonce += 1;
    exerciseDemoDialogOpen = true;
  };

  $effect(() => {
    if (!data.isLoggedIn || !exerciseDemoDialogOpen || !selectedExerciseName || !demoSearchForm) {
      return;
    }

    if (demoSearchOpenNonce === lastAutoSearchOpenNonce) {
      return;
    }

    lastAutoSearchOpenNonce = demoSearchOpenNonce;
    demoSearchForm.requestSubmit();
  });

  const getCurrentDemoResult = (): DemoSearchActionResult | null => {
    if (!selectedExerciseName || !form || typeof form !== 'object') {
      return null;
    }

    const candidate = form as DemoSearchActionResult;
    if (candidate.exerciseName !== selectedExerciseName) {
      return null;
    }

    return candidate;
  };

  const scrollToDay = (dayNumber: number) => {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(`day-${dayNumber}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
</script>

<Seo title={data.workoutRoutine.name} />

<div class="w-full max-w-6xl mx-auto mt-2 space-y-7 sm:mt-4 sm:space-y-9">
  <a href="/browse" class="flex w-fit items-center gap-2 rounded-4xl border border-border bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground shadow-[3px_3px_0_0_var(--hard-shadow)] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--hard-shadow)] dark:bg-secondary dark:text-secondary-foreground">
    <ArrowLeftIcon class="size-4" />
    Back to Browse
  </a>

  <Card.Root class="rounded-4xl bg-card">
    <Card.Content class="p-5 sm:p-8">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex flex-col gap-4">
          <div>
            <p class="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Workout routine</p>
            <h1 class="text-3xl font-black tracking-tight text-foreground wrap-break-word sm:text-5xl">{data.workoutRoutine.name}</h1>
            {#if data.workoutRoutine.description}
              <p class="mt-3 max-w-3xl text-base font-semibold leading-7 text-muted-foreground wrap-break-word sm:text-lg">{data.workoutRoutine.description}</p>
            {/if}
            <div class="mt-4 flex flex-wrap gap-3">
              <Badge variant="default" class="h-9 rounded-4xl border-border px-4 text-sm font-black">
                {formatEnumLabel(data.workoutRoutine.workout_type)}
              </Badge>
              <Badge variant="secondary" class="h-9 rounded-4xl border-border px-4 text-sm font-black">
                {formatEnumLabel(data.workoutRoutine.workout_difficulty)}
              </Badge>
            </div>
          </div>
          
          <a href={`/${data.userProfile.username}`} class="block w-fit rounded-3xl border border-border bg-background transition-colors hover:bg-muted dark:bg-muted dark:hover:bg-card">
            <ProfileCard profile={data.userProfile} class="p-3" />
          </a>
          <p class="px-1 text-sm font-bold text-muted-foreground">
            {data.favoritesCount} {data.favoritesCount === 1 ? 'favorite' : 'favorites'}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3 self-start">
          {#if data.isLoggedIn}
            <form method="POST" action={data.isFavorited ? '?/unfavorite' : '?/favorite'} use:enhance={enhanceFavorite}>
              <Button type="submit" variant="outline" disabled={isFavoritePending}>
                {#if isFavoritePending}
                  <Spinner />
                  {data.isFavorited ? 'Removing...' : 'Adding...'}
                {:else}
                  <HeartIcon class={`h-4 w-4 ${data.isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
                  {data.isFavorited ? 'Favorited' : 'Add to favorites'}
                {/if}
              </Button>
            </form>
          {:else}
            <Button href="/login" variant="outline">
              <HeartIcon class="h-4 w-4" />
              Add to favorites
            </Button>
          {/if}

          <Button variant="default" size="lg" class="px-4 sm:px-6" onclick={shareWorkout}>
            <Share2Icon class="size-4" />
            Share Workout
          </Button>
          {#if data.profile?.username === data.userProfile.username}
            <Button href={`/${data.userProfile.username}/${data.workoutRoutine.slug}/edit`} variant="secondary">
              <PencilIcon class="size-4" />
              Edit
            </Button>
          {/if}
        </div>
      </div>

      <div class="mt-8 grid gap-4 border-t border-border pt-8 text-foreground sm:grid-cols-3">
        <div class="flex items-center gap-4">
          <div class="flex h-13 w-13 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground">
            <Clock3Icon class="size-6" />
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Avg Duration</span>
            <span class="text-xl font-black">{avgDurationPerWorkoutDay} min/day</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex h-13 w-13 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground">
            <CalendarDaysIcon class="size-6" />
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Weekly Split</span>
            <span class="text-xl font-black">{workoutDaysCount} on / {restDaysCount} rest</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex h-13 w-13 items-center justify-center rounded-full border border-border bg-accent text-accent-foreground">
            <ZapIcon class="size-6" />
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Total Exercises</span>
            <span class="text-xl font-black">{totalExercises}</span>
          </div>
        </div>
      </div>
    </Card.Content>
  </Card.Root>

  <div class="mt-10 flex flex-col gap-2 sm:mt-12">
    <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Training week</p>
    <h2 class="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Weekly Schedule</h2>
  </div>
  
  {#if data.workoutDaysData}
    <div class="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
      {#each data.workoutDaysData as day}
        {@const isRestDay = !day.workout_exercises || day.workout_exercises.length === 0}
        <Button 
          variant={isRestDay ? "outline" : "default"}
          class="h-auto w-full flex-col gap-1 py-3"
          onclick={() => scrollToDay(day.day_number)}
        >
          <span class="text-sm font-black">{getDayTitle(day.day_number)}</span>
          <span class="w-full truncate px-1 text-center text-xs font-semibold opacity-80">
            {isRestDay ? 'Rest' : (day.day_focus || `${day.workout_exercises?.length || 0} exercises`)}
          </span>
        </Button>
      {/each}
    </div>

    <div class="space-y-6">
      {#each data.workoutDaysData as day}
        <Card.Root id="day-{day.day_number}" class="scroll-mt-6 overflow-hidden rounded-4xl bg-card">
          <div class="flex flex-col justify-between gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:p-6">
            <h3 class="text-xl font-black text-foreground sm:text-2xl">
              {getDayTitle(day.day_number)}
            </h3>
            <div class="flex flex-wrap items-center gap-2">
              {#if day.day_focus?.trim()}
                <span class="rounded-4xl border border-border bg-primary px-5 py-2 text-sm font-black text-primary-foreground">
                  {day.day_focus}
                </span>
              {/if}
              {#if !day.workout_exercises || day.workout_exercises.length === 0}
                <span class="rounded-4xl border border-border bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                  Rest Day
                </span>
              {/if}
            </div>
          </div>
          <div class="p-0">
            {#if day.workout_exercises && day.workout_exercises.length > 0}
              <div class="overflow-x-auto">
                <Table.Root class="w-full text-sm">
                  <Table.Header class="border-b border-border bg-background dark:bg-muted">
                    <Table.Row class="hover:bg-transparent">
                      <Table.Head class="w-15 py-4 text-center font-black">#</Table.Head>
                      <Table.Head class="py-4 text-xs font-black uppercase tracking-wide">Exercise</Table.Head>
                      <Table.Head class="py-4 text-xs font-black uppercase tracking-wide">Sets</Table.Head>
                      <Table.Head class="py-4 text-xs font-black uppercase tracking-wide">Reps</Table.Head>
                      <Table.Head class="py-4 text-xs font-black uppercase tracking-wide">Weight</Table.Head>
                      <Table.Head class="py-4 text-xs font-black uppercase tracking-wide">Notes</Table.Head>
                      <Table.Head class="py-4 text-xs font-black uppercase tracking-wide">Demo</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each day.workout_exercises as exercise, index (exercise.id)}
                      <Table.Row class="border-b border-border transition-colors hover:bg-muted/70">
                        <Table.Cell class="py-4 text-center font-black text-muted-foreground">{index + 1}</Table.Cell>
                        <Table.Cell class="py-4 font-black text-foreground">{exercise.name}</Table.Cell>
                        <Table.Cell class="py-4 font-bold text-foreground">{exercise.sets || '-'}</Table.Cell>
                        <Table.Cell class="py-4 font-black text-primary">{exercise.reps || '-'}</Table.Cell>
                        <Table.Cell class="py-4 font-bold text-foreground">{exercise.weight ? `${exercise.weight} lbs` : '-'}</Table.Cell>
                        <Table.Cell class="py-4 font-semibold text-muted-foreground">{exercise.notes || '-'}</Table.Cell>
                        <Table.Cell class="py-4">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onclick={() => openExerciseDemoDialog(exercise.name)}
                          >
                            <VideoIcon class="size-4" />
                            Watch Demo
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>
            {:else}
              <div class="flex justify-center p-10 text-center font-bold text-muted-foreground">
                {day.notes || "Take this day to rest and recover. Stay hydrated!"}
              </div>
            {/if}
          </div>
        </Card.Root>
      {/each}
    </div>
  {/if}
</div>

<Dialog.Root bind:open={exerciseDemoDialogOpen}>
  <Dialog.Content class="sm:max-w-xl">
    <Dialog.Header>
      <Dialog.Title>Exercise Video Demo</Dialog.Title>
      <Dialog.Description>
        Find a YouTube demonstration for {selectedExerciseName ?? 'the selected exercise'}.
      </Dialog.Description>
    </Dialog.Header>

    {#if selectedExerciseName}
      {@const demoResult = getCurrentDemoResult()}
      {@const hasDemoError = Boolean(demoResult?.error)}

      {#if !data.isLoggedIn}
        <div class="mt-3 flex justify-center">
          <Button variant="default" class="rounded-xl" disabled>
            You Must Log In
          </Button>
        </div>
      {:else if demoResult?.videoUrl}
        <div class="mt-3 flex justify-center">
          <Button
            href={demoResult.videoUrl}
            variant="default"
            class="rounded-xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Demo Video
          </Button>
        </div>
      {:else if hasDemoError}
        <div class="mt-3 flex justify-center">
          <Button variant="default" class="rounded-xl" disabled>
            Video Not Found
          </Button>
        </div>
      {:else}
        <form bind:this={demoSearchForm} method="POST" action="?/searchDemoVideo" use:enhance={enhanceDemoSearch} class="mt-3 flex justify-center">
          <input type="hidden" name="exerciseName" value={selectedExerciseName} />
          <Button type="submit" variant="default" class="rounded-xl" disabled={isDemoSearchPending}>
            {#if isDemoSearchPending}
              <Spinner />
              Searching...
            {:else}
              Search for Demo Video
            {/if}
          </Button>
        </form>
      {/if}
    {/if}
  </Dialog.Content>
</Dialog.Root>
