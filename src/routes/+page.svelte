<script lang="ts">
  import Seo from '$lib/components/seo.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  import ActivityIcon from '@lucide/svelte/icons/activity';
  import BotIcon from '@lucide/svelte/icons/bot';
  import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
  import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list';
  import DumbbellIcon from '@lucide/svelte/icons/dumbbell';
  import HeartIcon from '@lucide/svelte/icons/heart';
  import ListChecksIcon from '@lucide/svelte/icons/list-checks';
  import SearchIcon from '@lucide/svelte/icons/search';
  import Share2Icon from '@lucide/svelte/icons/share-2';
  import TimerIcon from '@lucide/svelte/icons/timer';
  import UserRoundIcon from '@lucide/svelte/icons/user-round';
  import VideoIcon from '@lucide/svelte/icons/video';

  const splitDays = [
    { day: 'Mon', focus: 'Push', tone: 'bg-primary text-primary-foreground', lifts: ['Bench press', 'Overhead press', 'Cable fly'] },
    { day: 'Tue', focus: 'Pull', tone: 'bg-secondary text-secondary-foreground', lifts: ['Deadlift', 'Pull-up', 'Face pull'] },
    { day: 'Wed', focus: 'Legs', tone: 'bg-accent text-accent-foreground', lifts: ['Squat', 'RDL', 'Leg press'] },
    { day: 'Thu', focus: 'Rest', tone: 'bg-muted text-muted-foreground', lifts: [] },
  ];

  const buildFeatures = [
    {
      icon: CalendarDaysIcon,
      title: 'Plan the week',
      description: 'Use weekdays or numbered days, add rest days, and name each focus so the split reads clearly.'
    },
    {
      icon: ListChecksIcon,
      title: 'Track the lift details',
      description: 'Keep exercises, sets, reps, weight, and notes in one routine page instead of a scattered notes app.'
    },
    {
      icon: BotIcon,
      title: 'Tune it with the assistant',
      description: 'Ask for changes in plain language and let the routine assistant update the split you are editing.'
    },
  ];

  const shareFeatures = [
    {
      icon: Share2Icon,
      title: 'Share a clean link',
      description: 'Every routine gets a readable public URL you can copy from the workout page or routine cards.'
    },
    {
      icon: VideoIcon,
      title: 'Open demo videos',
      description: 'Logged-in users can search for exercise demos from the public workout view.'
    },
    {
      icon: HeartIcon,
      title: 'Save favorites',
      description: 'Favorite routines you want to revisit and see which splits the community is into.'
    },
  ];
</script>

<Seo />

<div class="mx-auto flex w-full max-w-6xl flex-col gap-20 py-6 sm:gap-28 sm:py-10">
  <section class="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
    <div class="flex flex-col items-start gap-5 text-left">
      <span class="inline-flex items-center gap-2 rounded-4xl border border-border bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground shadow-sm">
        <DumbbellIcon class="size-4" />
        Create. Tune. Share.
      </span>

      <div class="flex max-w-3xl flex-col gap-4">
        <h1 class="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Create and share
          <span class="inline-block rounded-3xl border border-border bg-primary px-3 text-primary-foreground shadow-sm">
            Your
          </span>
          workout
          <span class="inline-block rounded-3xl border border-border bg-primary px-3 text-primary-foreground shadow-sm">
            Split
          </span>.
        </h1>
        <p class="max-w-2xl text-base font-semibold leading-7 text-muted-foreground sm:text-xl">
          Build a routine with training days, exercises, sets, reps, and notes, then publish it as one clean link people can actually follow.
        </p>
      </div>

      <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <a href="/new" class="{buttonVariants({ variant: 'default', size: 'lg' })} w-full px-6 py-6 text-base sm:w-auto">
          <CalendarDaysIcon class="size-5" />
          Create Your Split
        </a>
        <a href="/browse" class="{buttonVariants({ variant: 'secondary', size: 'lg' })} w-full px-6 py-6 text-base sm:w-auto">
          <ActivityIcon class="size-5" />
          Browse Routines
        </a>
      </div>
    </div>

    <div class="lg:perspective-distant">
    <div class="rounded-4xl border border-border bg-card p-4 shadow-lg transition-transform duration-700 ease-out will-change-transform sm:p-5 lg:rotate-x-[8deg] lg:rotate-y-[-14deg] lg:hover:rotate-x-0 lg:hover:rotate-y-0">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Published split</p>
            <h2 class="mt-1 text-2xl font-black text-foreground sm:text-3xl">Boden's Routine</h2>
            <p class="mt-2 text-sm font-bold text-muted-foreground">yoursplit.com/boden/bodens-routine</p>
          </div>
          <div class="inline-flex w-fit items-center gap-2 rounded-4xl border border-border bg-accent px-3 py-2 text-sm font-black text-accent-foreground">
            <Share2Icon class="size-4" />
            Share link
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          {#each splitDays as item}
            <div class="rounded-3xl border border-border bg-background p-4 text-left dark:bg-muted">
              <div class="mb-4 flex items-center justify-between gap-2">
                <span class="rounded-3xl border border-border px-3 py-1 text-xs font-black">{item.day}</span>
                <span class="{item.tone} rounded-3xl border border-border px-3 py-1 text-xs font-black">{item.focus}</span>
              </div>
              {#if item.lifts.length > 0}
                <div class="space-y-2">
                  {#each item.lifts as lift, index}
                    <div class="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 dark:bg-card">
                      <span class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-black dark:bg-muted">{index + 1}</span>
                      <span class="truncate text-sm font-bold">{lift}</span>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="rounded-2xl border border-border bg-card px-3 py-5 text-center text-sm font-bold text-muted-foreground dark:bg-card">Rest and recover</p>
              {/if}
            </div>
          {/each}
        </div>

        <div class="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <div class="flex items-center gap-3">
            <span class="flex size-11 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground">
              <TimerIcon class="size-5" />
            </span>
            <div>
              <p class="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Estimate</p>
              <p class="text-lg font-black">58 min/day</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="flex size-11 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground">
              <ClipboardListIcon class="size-5" />
            </span>
            <div>
              <p class="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Structure</p>
              <p class="text-lg font-black">3 on / 1 rest</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="flex size-11 items-center justify-center rounded-full border border-border bg-accent text-accent-foreground">
              <VideoIcon class="size-5" />
            </span>
            <div>
              <p class="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Demos</p>
              <p class="text-lg font-black">One click</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </section>

  <section class="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
    <div class="rounded-4xl border border-border bg-primary p-6 text-primary-foreground shadow-lg sm:p-7">
      <p class="text-xs font-black uppercase tracking-[0.16em]">Routine builder</p>
      <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Everything your split needs before it leaves your head.</h2>
      <p class="mt-4 text-base font-bold leading-7">
        Start with a blank routine, shape the week, add the lifts, and keep the link ready as you edit.
      </p>
      <a href="/new" class="{buttonVariants({ variant: 'secondary', size: 'lg' })} mt-6 w-full px-5 sm:w-fit">
        <CalendarDaysIcon class="size-5" />
        Start Building
      </a>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      {#each buildFeatures as feature}
        {@const FeatureIcon = feature.icon}
        <article class="rounded-4xl border border-border bg-card p-5 text-left shadow-md">
          <div class="mb-4 flex size-12 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground">
            <FeatureIcon class="size-5" />
          </div>
          <h3 class="text-xl font-black text-foreground">{feature.title}</h3>
          <p class="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{feature.description}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
    <div class="grid gap-5 md:grid-cols-3">
      {#each shareFeatures as feature}
        {@const FeatureIcon = feature.icon}
        <article class="rounded-4xl border border-border bg-card p-5 text-left shadow-md">
          <div class="mb-4 flex size-12 items-center justify-center rounded-full border border-border bg-accent text-accent-foreground">
            <FeatureIcon class="size-5" />
          </div>
          <h3 class="text-xl font-black text-foreground">{feature.title}</h3>
          <p class="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{feature.description}</p>
        </article>
      {/each}
    </div>

    <div class="rounded-4xl border border-border bg-secondary p-6 text-secondary-foreground shadow-lg sm:p-7">
      <p class="text-xs font-black uppercase tracking-[0.16em]">Shareable workout pages</p>
      <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Make a routine that is useful after you send it.</h2>
      <p class="mt-4 text-base font-bold leading-7">
        Public pages show the weekly schedule, day focus, exercise table, favorites, and share controls without making anyone decode your spreadsheet.
      </p>
      <a href="/browse" class="{buttonVariants({ variant: 'default', size: 'lg' })} mt-6 w-full px-5 sm:w-fit">
        <Share2Icon class="size-5" />
        See Shared Splits
      </a>
    </div>
  </section>

  <section class="rounded-4xl border border-border bg-card p-5 shadow-lg sm:p-7">
    <div class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Community library</p>
        <h2 class="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Browse splits by goal, difficulty, creator, or exercise.</h2>
        <p class="mt-4 text-base font-semibold leading-7 text-muted-foreground">
          Search the routine library, filter by workout type and difficulty, follow creators, and keep favorites close for your next training block.
        </p>
        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="/browse" class="{buttonVariants({ variant: 'default', size: 'lg' })} w-full px-5 sm:w-fit">
            <SearchIcon class="size-5" />
            Browse the Library
          </a>
          <a href="/new" class="{buttonVariants({ variant: 'secondary', size: 'lg' })} w-full px-5 sm:w-fit">
            <DumbbellIcon class="size-5" />
            Create Your Own
          </a>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-3xl border border-border bg-background p-4 dark:bg-muted">
          <div class="mb-4 flex items-center gap-2 text-sm font-black text-primary">
            <SearchIcon class="size-4" />
            Search and filter
          </div>
          <div class="flex flex-wrap gap-2">
            <span class="rounded-4xl border border-border bg-primary px-3 py-1 text-xs font-black text-primary-foreground">Strength</span>
            <span class="rounded-4xl border border-border bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">Beginner</span>
            <span class="rounded-4xl border border-border bg-accent px-3 py-1 text-xs font-black text-accent-foreground">Following</span>
          </div>
        </div>
        <div class="rounded-3xl border border-border bg-background p-4 dark:bg-muted">
          <div class="mb-4 flex items-center gap-2 text-sm font-black text-primary">
            <UserRoundIcon class="size-4" />
            Profiles and favorites
          </div>
          <div class="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-3 py-2 dark:bg-card">
            <span class="truncate text-sm font-bold">@boden</span>
            <span class="inline-flex items-center gap-1 text-sm font-black text-destructive">
              <HeartIcon class="size-4 fill-destructive" />
              12
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
