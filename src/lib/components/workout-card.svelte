<script module lang="ts">
  export type DayPreview = {
    dayLabel?: string;
    numExercises: number;
  };
  export type WorkoutRoutineCardProps = {
    name: string;
    href: string;
    usesNumberedDays: boolean;
    daysPreview: DayPreview[];
    totalExercises: number;
  };
</script>

<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';

  let { name, href, usesNumberedDays, daysPreview, totalExercises }: WorkoutRoutineCardProps = $props();
</script>

<a {href}>
  <Card.Root>
    <Card.Header>
      <Card.Title class="text-xl">{name}</Card.Title>
    </Card.Header>
    <Card.Content>
      {#if daysPreview.length === 0}
        <p class="text-sm text-muted-foreground">No workout days yet</p>
      {:else}
        <ul class="flex flex-col gap-1">
          {#each daysPreview as day, index}
            {@const dayLabel = day.dayLabel ? `: ${day.dayLabel}` : ''}
            <li class="flex flex-row gap-2 justify-between">
              <p class="text-sm text-muted-foreground">
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
              <p class="text-sm">
                {day.numExercises} {day.numExercises === 1 ? 'exercise' : 'exercises'}
              </p>
            </li>
          {/each}
          {#if daysPreview.length > 3}
            <li>
              <p class="text-sm text-muted-foreground">+{daysPreview.length - 3} more workout days</p>
            </li>
          {/if}
        </ul>
      {/if}
      <Separator class="mt-6 h-2" />
    </Card.Content>
    <Card.Footer>
      <p class="text-sm font-semibold">{totalExercises} exercises</p>
    </Card.Footer>
  </Card.Root>
</a>
