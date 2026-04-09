<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageProps } from './$types';
  import WorkoutCard from '$lib/components/workout-card.svelte';
  import * as Pagination from '$lib/components/ui/pagination';

  let { data }: PageProps = $props();

  const browseHref = (page: number) => (page <= 1 ? '/browse' : `/browse?page=${page}`);

  const handlePageChange = async (nextPage: number) => {
    if (nextPage === data.page) {
      return;
    }

    await goto(browseHref(nextPage), {
      keepFocus: true,
      noScroll: true,
    });
  };
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

  {#if data.workoutRoutines.length === 0}
    <p class="text-lg text-muted-foreground">No routines found on this page.</p>
  {:else}
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
