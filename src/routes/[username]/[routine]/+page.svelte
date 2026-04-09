<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from '$lib/components/ui/button';
  import * as Table from '$lib/components/ui/table';
  import { Badge } from '$lib/components/ui/badge';

  let { data }: PageProps = $props();
</script>

<div class="space-y-6">
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">{data.workoutRoutine.name}</h1>
      {#if data.workoutRoutine.description}
        <p class="text-muted-foreground mt-2">{data.workoutRoutine.description}</p>
      {/if}
    </div>

    {#if data.profile?.username === data.userProfile.username}
      <Button href={`/${data.userProfile.username}/${data.workoutRoutine.slug}/edit`} class="self-start">
        Edit Routine
      </Button>
    {/if}
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-semibold tracking-tight">Weekly Schedule</h2>
    
    {#if data.workoutDaysData}
      <div class="space-y-4">
        {#each data.workoutDaysData as day}
          <div class="rounded-xl border bg-card text-card-foreground shadow">
            <div class="flex flex-col space-y-1.5 p-6 pb-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold leading-none tracking-tight text-lg">
                  {day.day_label || `Day ${day.day_number}`}
                </h3>
                {#if day.workout_exercises && day.workout_exercises.length > 0}
                  <!-- Badge optional, assuming we don't have tags in db -->
                {:else}
                  <Badge variant="secondary">Rest Day</Badge>
                {/if}
              </div>
            </div>
            <div class="p-6 pt-0">
              {#if day.workout_exercises && day.workout_exercises.length > 0}
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head class="w-[50px]">#</Table.Head>
                      <Table.Head>Exercise</Table.Head>
                      <Table.Head>Sets</Table.Head>
                      <Table.Head>Reps</Table.Head>
                      <Table.Head>Weight</Table.Head>
                      <Table.Head>Notes</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each day.workout_exercises as exercise, index (exercise.id)}
                      <Table.Row>
                        <Table.Cell class="font-medium text-muted-foreground">{index + 1}</Table.Cell>
                        <Table.Cell class="font-bold">{exercise.name}</Table.Cell>
                        <Table.Cell class="font-bold">{exercise.sets || '—'}</Table.Cell>
                        <Table.Cell class="font-bold text-blue-500">{exercise.reps || '—'}</Table.Cell>
                        <Table.Cell class="font-bold">{exercise.weight ? `${exercise.weight} lbs` : '—'}</Table.Cell>
                        <Table.Cell class="text-muted-foreground">{exercise.notes || '—'}</Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              {:else}
                <div class="flex justify-center p-8 text-muted-foreground text-sm">
                  {day.notes || "Take this day to rest and recover. Stay hydrated!"}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
