<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageProps } from './$types';
  import Seo from '$lib/components/seo.svelte';
  import WorkoutCard from '$lib/components/workout-card.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Pagination from '$lib/components/ui/pagination';
  import { WORKOUT_DIFFICULTY_FILTER_OPTIONS, WORKOUT_TYPE_FILTER_OPTIONS } from '$lib/constants';
  import FilterIcon from '@lucide/svelte/icons/filter';
  import GaugeIcon from '@lucide/svelte/icons/gauge';
  import UsersIcon from '@lucide/svelte/icons/users';
  import SearchIcon from '@lucide/svelte/icons/search';
  import XIcon from '@lucide/svelte/icons/x';

  let { data }: PageProps = $props();

  const workoutTypeOptions = WORKOUT_TYPE_FILTER_OPTIONS;
  const workoutDifficultyOptions = WORKOUT_DIFFICULTY_FILTER_OPTIONS;

  const browseHref = (
    page: number,
    workoutType: string | null = data.workoutType,
    workoutDifficulty: string | null = data.workoutDifficulty,
    workoutSearch: string | null = data.search,
    followingOnly: boolean = data.followingOnly,
  ) => {
    const params = new URLSearchParams();

    if (workoutType) {
      params.set('type', workoutType);
    }

    if (workoutDifficulty) {
      params.set('difficulty', workoutDifficulty);
    }

    if (workoutSearch) {
      params.set('search', workoutSearch);
    }

    if (followingOnly) {
      params.set('following', 'true');
    }

    if (page > 1) {
      params.set('page', String(page));
    }

    const query = params.toString();
    return query ? `/browse?${query}` : '/browse';
  };

  const handlePageChange = async (nextPage: number) => {
    if (nextPage === data.page) {
      return;
    }

    await goto(browseHref(nextPage), {
      keepFocus: true,
      noScroll: true,
    });
  };

  const handleTypeFilterChange = async (nextType: string | null) => {
    if (nextType === data.workoutType) {
      return;
    }

    await goto(browseHref(1, nextType, data.workoutDifficulty, data.search, data.followingOnly), {
      keepFocus: true,
      noScroll: true,
    });
  };

  const handleDifficultyFilterChange = async (nextDifficulty: string | null) => {
    if (nextDifficulty === data.workoutDifficulty) {
      return;
    }

    await goto(browseHref(1, data.workoutType, nextDifficulty, data.search, data.followingOnly), {
      keepFocus: true,
      noScroll: true,
    });
  };

  const handleFollowingFilterChange = async (nextFollowingOnly: boolean) => {
    if (nextFollowingOnly === data.followingOnly) {
      return;
    }

    await goto(browseHref(1, data.workoutType, data.workoutDifficulty, data.search, nextFollowingOnly), {
      keepFocus: true,
      noScroll: true,
    });
  };

  const handleSearchSubmit = async (event: Event) => {
    event.preventDefault();

    const searchForm = event.currentTarget;
    if (!(searchForm instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(searchForm);
    const formSearchValue = formData.get('search');
    const formSearchText = typeof formSearchValue === 'string' ? formSearchValue : '';

    const nextSearch = formSearchText.trim() || null;

    if (nextSearch === data.search) {
      return;
    }

    await goto(browseHref(1, data.workoutType, data.workoutDifficulty, nextSearch, data.followingOnly), {
      keepFocus: true,
      noScroll: true,
    });
  };

  const clearSearch = async () => {
    if (!data.search) {
      return;
    }

    await goto(browseHref(1, data.workoutType, data.workoutDifficulty, null, data.followingOnly), {
      keepFocus: true,
      noScroll: true,
    });
  };
</script>

<Seo title="Browse" />

<div class="my-6 flex flex-col items-center gap-8 sm:my-8 sm:gap-12">
  <div class="flex w-full max-w-5xl flex-col gap-5 rounded-4xl border border-border bg-card p-5 text-left shadow-lg sm:p-8">
    <div>
      <p class="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Routine library</p>
      <h1 class="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
        Discover Your Next <span class="text-primary">Workout</span>
      </h1>
      <p class="mt-3 max-w-2xl text-base font-semibold leading-7 text-muted-foreground sm:text-lg">
        Browse community-created workout routines and start your fitness journey today
      </p>
    </div>

    <form class="mt-4 flex w-full max-w-xl items-center gap-2" onsubmit={handleSearchSubmit}>
      <Input
        name="search"
        type="search"
        value={data.search ?? ''}
        placeholder="Search routine, exercise, or creator"
        aria-label="Search workouts"
        class="min-w-0 flex-1"
      />
      <Button type="submit" size="icon" class="sm:hidden" aria-label="Search">
        <SearchIcon class="size-4" />
      </Button>
      <Button type="submit" class="hidden sm:inline-flex">
        <SearchIcon class="size-4" />
        Search
      </Button>
      {#if data.search}
        <Button type="button" variant="outline" size="icon" class="sm:hidden" aria-label="Clear search" onclick={clearSearch}>
          <XIcon class="size-4" />
        </Button>
        <Button type="button" variant="outline" class="hidden sm:inline-flex" onclick={clearSearch}>Clear</Button>
      {/if}
    </form>

    <div class="flex w-full flex-col items-start gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-muted-foreground text-sm font-bold flex items-center gap-1.5 mr-2">
          <FilterIcon class="size-4" />
          Type:
        </span>

        {#each workoutTypeOptions as option}
          <Button
            type="button"
            variant={option.value === data.workoutType ? 'default' : 'outline'}
            size="sm"
            aria-pressed={option.value === data.workoutType}
            onclick={() => handleTypeFilterChange(option.value)}
          >
            {option.label}
          </Button>
        {/each}
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="text-muted-foreground text-sm font-bold flex items-center gap-1.5 mr-2">
          <GaugeIcon class="size-4" />
          Difficulty:
        </span>

        {#each workoutDifficultyOptions as option}
          <Button
            type="button"
            variant={option.value === data.workoutDifficulty ? 'default' : 'outline'}
            size="sm"
            aria-pressed={option.value === data.workoutDifficulty}
            onclick={() => handleDifficultyFilterChange(option.value)}
          >
            {option.label}
          </Button>
        {/each}
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="text-muted-foreground text-sm font-bold flex items-center gap-1.5 mr-2">
          <UsersIcon class="size-4" />
          Creator:
        </span>

        <Button
          type="button"
          variant={!data.followingOnly ? 'default' : 'outline'}
          size="sm"
          aria-pressed={!data.followingOnly}
          onclick={() => handleFollowingFilterChange(false)}
        >
          Everyone
        </Button>

        <Button
          type="button"
          variant={data.followingOnly ? 'default' : 'outline'}
          size="sm"
          aria-pressed={data.followingOnly}
          onclick={() => handleFollowingFilterChange(true)}
        >
          Following
        </Button>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3 border-t border-border pt-4">
      <p class="text-sm font-bold text-muted-foreground">
        <span class="text-foreground font-black">{data.totalWorkoutRoutines}</span>
        {data.totalWorkoutRoutines === 1 ? 'routine' : 'routines'} match your filters
      </p>
    </div>
  </div>

  {#if data.workoutRoutines.length === 0}
    <div class="flex w-full max-w-5xl flex-col items-center gap-4 rounded-4xl border border-border bg-card px-6 py-12 text-center shadow-md">
      <div class="flex size-14 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
        <SearchIcon class="size-6" />
      </div>
      <h2 class="text-xl font-black text-foreground">No routines found</h2>
      <p class="max-w-md text-sm font-semibold text-muted-foreground">
        Try clearing a filter or searching for a different term.
      </p>
    </div>
  {:else}
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
      {#each data.workoutRoutines as workoutRoutine}
        <WorkoutCard {...workoutRoutine} />
      {/each}
    </div>
  {/if}

  <div class="w-full flex flex-col items-center gap-3">
    <Pagination.Root
      count={data.totalWorkoutRoutines}
      perPage={data.pageSize}
      page={data.page}
      onPageChange={handlePageChange}
    >
      {#snippet children({ pages, currentPage })}
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.PrevButton />
          </Pagination.Item>

          {#each pages as page (page.key)}
            {#if page.type === 'ellipsis'}
              <Pagination.Item>
                <Pagination.Ellipsis />
              </Pagination.Item>
            {:else}
              <Pagination.Item>
                <Pagination.Link {page} isActive={currentPage === page.value}>
                  {page.value}
                </Pagination.Link>
              </Pagination.Item>
            {/if}
          {/each}

          <Pagination.Item>
            <Pagination.NextButton />
          </Pagination.Item>
        </Pagination.Content>
      {/snippet}
    </Pagination.Root>
    <p class="text-sm text-muted-foreground">Page {data.page}</p>
  </div>
</div>
