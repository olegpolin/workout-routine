<script module lang="ts">
  export type DayPreview = {
    dayLabel?: string;
    numExercises: number;
  };
  export type WorkoutRoutineCardProps = {
    name: string;
    username: string;
    href: string;
    usesNumberedDays: boolean;
    workoutType: string;
    workoutDifficulty: string;
    daysPreview: DayPreview[];
    totalExercises: number;
    favoritesCount: number;
  };
</script>

<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';
  import { toast } from 'svelte-sonner';
  import { ESTIMATED_MINUTES_PER_EXERCISE } from '$lib/constants';
  import Share2Icon from '@lucide/svelte/icons/share-2';
  import Clock3Icon from '@lucide/svelte/icons/clock-3';
  import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
  import ZapIcon from '@lucide/svelte/icons/zap';
  import HeartIcon from '@lucide/svelte/icons/heart';
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

  let { name, username, href, usesNumberedDays, workoutType, workoutDifficulty, daysPreview, totalExercises, favoritesCount }: WorkoutRoutineCardProps = $props();

  const workoutDaysCount = $derived(daysPreview.filter(d => d.numExercises > 0).length);
  const restDaysCount = $derived(daysPreview.length - workoutDaysCount);

  const avgDurationPerWorkoutDay = $derived(workoutDaysCount > 0 ? Math.round((totalExercises * ESTIMATED_MINUTES_PER_EXERCISE) / workoutDaysCount) : 0);

  const shareWorkout = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = new URL(href, window.location.origin).toString();
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatEnumLabel = (value: string) =>
    value.length > 0 ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
</script>

<a {href} class="group/wcard block focus-visible:outline-none">
  <Card.Root class="overflow-hidden rounded-4xl transition-all group-hover/wcard:translate-x-1 group-hover/wcard:translate-y-1 group-hover/wcard:shadow-none group-focus-visible/wcard:ring group-focus-visible/wcard:ring-ring group-focus-visible/wcard:ring-offset-2">
    <Card.Header class="pb-2">
      <div class="flex flex-wrap items-start justify-between gap-2 sm:gap-4">
        <div class="flex min-w-0 flex-col gap-2">
          <div class="flex flex-col gap-0.5">
            <Card.Title class="text-lg sm:text-xl font-black text-foreground wrap-break-word">{name}</Card.Title>
            <p class="text-sm text-muted-foreground font-bold">@{username}</p>
            <p class="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground font-bold">
              <HeartIcon class="size-3 text-destructive {favoritesCount > 0 ? 'fill-destructive' : ''}" />
              {favoritesCount} {favoritesCount === 1 ? 'favorite' : 'favorites'}
            </p>
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="inline-flex items-center rounded-4xl border border-border bg-primary px-2.5 py-1 font-black text-primary-foreground">
              {formatEnumLabel(workoutType)}
            </span>
            <span class="inline-flex items-center rounded-4xl border border-border bg-secondary px-2.5 py-1 font-black text-secondary-foreground">
              {formatEnumLabel(workoutDifficulty)}
            </span>
          </div>
        </div>
        <span
          role="button"
          tabindex="0"
          aria-label="Copy share link"
          class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-4xl border border-border bg-background px-2.5 py-1 text-xs font-black text-primary shadow-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3"
          onclick={shareWorkout}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              shareWorkout(e as unknown as MouseEvent);
            }
          }}
        >
          <Share2Icon class="size-3.5" />
          Share
        </span>
      </div>
    </Card.Header>
    <Card.Content class="pt-4">
      {#if daysPreview.length === 0}
        <p class="text-sm text-muted-foreground">No workout days yet</p>
      {:else}
        <ul class="flex flex-col gap-2">
          {#each daysPreview.slice(0, 3) as day, index}
            {@const dayLabel = day.dayLabel ? `: ${day.dayLabel}` : ''}
            <li class="flex flex-row items-center justify-between gap-2">
              <p class="min-w-0 truncate text-sm font-bold text-muted-foreground">
                {#if usesNumberedDays}
                  Day {index + 1}{dayLabel}
                {:else}
                  {#if index === 0}
                    Monday{dayLabel}
                  {:else if index === 1}
                    Tuesday{dayLabel}
                  {:else if index === 2}
                    Wednesday{dayLabel}
                  {/if}
                {/if}
              </p>
              <p class="shrink-0 whitespace-nowrap text-right text-sm font-black text-foreground">
                {day.numExercises} exercises
              </p>
            </li>
          {/each}
          {#if daysPreview.length > 3}
            <li class="mt-1">
              <p class="text-sm text-muted-foreground font-bold">+{daysPreview.length - 3} more workout days</p>
            </li>
          {/if}
        </ul>
      {/if}
    </Card.Content>
    <Separator class="bg-border" />
    <Card.Footer class="pt-4 flex items-center justify-between text-muted-foreground">
      <div class="flex items-center gap-2">
        <Clock3Icon class="size-4 text-primary" />
        <div class="flex flex-col leading-none">
          <span class="font-bold text-foreground">{avgDurationPerWorkoutDay}</span>
          <span class="text-[10px] text-muted-foreground">min/day</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <CalendarDaysIcon class="size-4 text-primary" />
        <div class="flex flex-col leading-none">
          <span class="font-bold text-foreground">{workoutDaysCount}d on / {restDaysCount}d</span>
          <span class="text-[10px] text-muted-foreground">rest</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <ZapIcon class="size-4 text-primary" />
        <div class="flex flex-col leading-none">
          <span class="font-bold text-foreground">{totalExercises}</span>
          <span class="text-[10px] text-muted-foreground">exercises</span>
        </div>
      </div>
      <ArrowRightIcon class="size-4 shrink-0 text-primary opacity-0 transition-all duration-200 group-hover/wcard:translate-x-1 group-hover/wcard:opacity-100" aria-hidden="true" />
    </Card.Footer>
  </Card.Root>
</a>
