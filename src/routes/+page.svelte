<script lang="ts">
  import Seo from '$lib/components/seo.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  import ActivityIcon from '@lucide/svelte/icons/activity';
  import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
  import DumbbellIcon from '@lucide/svelte/icons/dumbbell';
  import TimerIcon from '@lucide/svelte/icons/timer';
</script>

<Seo />

<div class="w-full max-w-6xl mx-auto my-auto py-8 sm:py-14">
  <section class="flex flex-col items-center gap-7 text-center">
    <span class="inline-flex items-center gap-2 rounded-4xl border border-border bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground shadow-sm dark:bg-secondary dark:text-secondary-foreground">
      <DumbbellIcon class="size-4" />
      YourSplit Routine Builder
    </span>

    <div class="flex max-w-4xl flex-col items-center gap-5">
      <h1 class="text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
        Create and share
        <span class="inline-block rounded-3xl border border-border bg-primary px-3 text-primary-foreground shadow-sm">
          Your
        </span>
        workout
        <span class="inline-block rounded-3xl border border-border bg-primary px-3 text-primary-foreground shadow-sm">
          Split
        </span>.
      </h1>
      <p class="max-w-2xl px-2 text-base font-semibold leading-7 text-muted-foreground sm:text-xl">
        Build a clean routine page for your training days, exercises, sets, and reps, then send one link anyone can follow.
      </p>
    </div>

    <div class="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
      <a href="/browse" class="{buttonVariants({ variant: 'default', size: 'lg' })} w-full px-6 py-6 text-base sm:w-auto">
        <ActivityIcon class="size-5" />
        Explore Workouts
      </a>
      <a href="/new" class="{buttonVariants({ variant: 'secondary', size: 'lg' })} w-full px-6 py-6 text-base sm:w-auto">
        <CalendarDaysIcon class="size-5" />
        Create a Plan
      </a>
    </div>
  </section>

  <section class="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
    <div class="rounded-4xl border border-border bg-card p-4 shadow-lg dark:bg-card sm:p-6">
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-left">
          <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Current split</p>
          <h2 class="text-2xl font-black text-foreground">Push / Pull / Legs</h2>
        </div>
        <div class="inline-flex w-fit items-center gap-2 rounded-4xl border border-border bg-accent px-3 py-2 text-sm font-black text-accent-foreground">
          <TimerIcon class="size-4" />
          58 min avg
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        {#each [
          { day: 'Mon', focus: 'Push', tone: 'bg-primary text-primary-foreground', lifts: ['Bench press', 'Overhead press', 'Cable fly'] },
          { day: 'Wed', focus: 'Pull', tone: 'bg-secondary text-secondary-foreground', lifts: ['Deadlift', 'Pull-up', 'Face pull'] },
          { day: 'Fri', focus: 'Legs', tone: 'bg-accent text-accent-foreground', lifts: ['Squat', 'RDL', 'Leg press'] }
        ] as item}
          <div class="rounded-3xl border border-border bg-background p-4 text-left dark:bg-muted">
            <div class="mb-4 flex items-center justify-between gap-2">
              <span class="rounded-3xl border border-border px-3 py-1 text-xs font-black">{item.day}</span>
              <span class="{item.tone} rounded-3xl border border-border px-3 py-1 text-xs font-black">{item.focus}</span>
            </div>
            <div class="space-y-2">
              {#each item.lifts as lift, index}
                <div class="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 dark:bg-card">
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-black dark:bg-muted">{index + 1}</span>
                  <span class="truncate text-sm font-bold">{lift}</span>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
      <div class="rounded-4xl border border-border bg-primary p-5 text-left text-primary-foreground shadow-md">
        <p class="text-3xl font-black">Build</p>
        <p class="mt-1 text-sm font-bold">lay out training days, focus areas, and rest days</p>
      </div>
      <div class="rounded-4xl border border-border bg-secondary p-5 text-left text-secondary-foreground shadow-md">
        <p class="text-3xl font-black">Organize</p>
        <p class="mt-1 text-sm font-bold">keep exercises, sets, reps, and notes easy to scan</p>
      </div>
      <div class="rounded-4xl border border-border bg-accent p-5 text-left text-accent-foreground shadow-md">
        <p class="text-3xl font-black">Share</p>
        <p class="mt-1 text-sm font-bold">send your split with one clean routine link</p>
      </div>
    </div>
  </section>
</div>
