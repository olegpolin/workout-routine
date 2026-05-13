<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageProps } from './$types';
  import Seo from '$lib/components/seo.svelte';
  import WorkoutCard from '$lib/components/workout-card.svelte';
  import { Input } from '$lib/components/ui/input';
  import * as Pagination from '$lib/components/ui/pagination';
  import { WORKOUT_DIFFICULTY_FILTER_OPTIONS, WORKOUT_TYPE_FILTER_OPTIONS } from '$lib/constants';

  let { data }: PageProps = $props();

  const workoutTypeOptions = WORKOUT_TYPE_FILTER_OPTIONS;
  const workoutDifficultyOptions = WORKOUT_DIFFICULTY_FILTER_OPTIONS;

  const filterButtonClass =
    'px-5 py-2 rounded-4xl border border-border bg-background text-foreground hover:bg-muted text-sm font-bold shadow-sm transition-all';
  const activeFilterButtonClass =
    'px-5 py-2 rounded-4xl border border-border bg-primary text-primary-foreground text-sm font-bold shadow-md transition-all';

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

    <form class="w-full max-w-xl mt-4 flex items-center gap-2" onsubmit={handleSearchSubmit}>
      <Input
        name="search"
        type="search"
        value={data.search ?? ''}
        placeholder="Search routine, exercise, or creator"
        aria-label="Search workouts"
      />
      <button type="submit" class={activeFilterButtonClass}>Search</button>
      {#if data.search}
        <button type="button" class={filterButtonClass} onclick={clearSearch}>Clear</button>
      {/if}
    </form>

    <div class="flex w-full flex-col items-start gap-4 font-medium">
      <div class="flex flex-wrap items-center justify-center gap-2">
        <span class="text-muted-foreground text-sm font-bold flex items-center gap-1.5 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            /></svg
          >
          Type:
        </span>

        {#each workoutTypeOptions as option}
          <button
            type="button"
            class={option.value === data.workoutType ? activeFilterButtonClass : filterButtonClass}
            aria-pressed={option.value === data.workoutType}
            onclick={() => handleTypeFilterChange(option.value)}
          >
            {option.label}
          </button>
        {/each}
      </div>

      <div class="flex flex-wrap items-center justify-center gap-2">
        <span class="text-muted-foreground text-sm font-bold mr-2">Difficulty:</span>

        {#each workoutDifficultyOptions as option}
          <button
            type="button"
            class={option.value === data.workoutDifficulty ? activeFilterButtonClass : filterButtonClass}
            aria-pressed={option.value === data.workoutDifficulty}
            onclick={() => handleDifficultyFilterChange(option.value)}
          >
            {option.label}
          </button>
        {/each}
      </div>

      <div class="flex flex-wrap items-center justify-center gap-2">
        <span class="text-muted-foreground text-sm font-bold mr-2">Creator:</span>

        <button
          type="button"
          class={!data.followingOnly ? activeFilterButtonClass : filterButtonClass}
          aria-pressed={!data.followingOnly}
          onclick={() => handleFollowingFilterChange(false)}
        >
          Everyone
        </button>

        <button
          type="button"
          class={data.followingOnly ? activeFilterButtonClass : filterButtonClass}
          aria-pressed={data.followingOnly}
          onclick={() => handleFollowingFilterChange(true)}
        >
          Following
        </button>
      </div>
    </div>
  </div>

  <div class="rounded-4xl border border-border bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground shadow-sm">Showing {data.totalWorkoutRoutines} workouts</div>

  {#if data.workoutRoutines.length === 0}
    <p class="rounded-4xl border border-border bg-card px-6 py-8 text-lg font-bold text-muted-foreground shadow-md">No routines found on this page.</p>
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
