<script lang="ts">
  import { page } from '$app/state';
  import { enhance as formEnhance } from '$app/forms';
  import { beforeNavigate } from '$app/navigation';
  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';
  import { Input } from '$lib/components/ui/input';
  import * as InputGroup from '$lib/components/ui/input-group';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Alert from '$lib/components/ui/alert';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import * as Accordion from '$lib/components/ui/accordion';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import { Spinner } from '$lib/components/ui/spinner';
  import { Accordion as AccordionPrimitive } from 'bits-ui';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import { toast } from 'svelte-sonner';
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { workoutFormSchema, type WorkoutFormSchema } from './workout-form-schema';
  import ChatSidebar from './chat-sidebar.svelte';
  import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
  import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import Trash2Icon from '@lucide/svelte/icons/trash-2';
  import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
  import ListOrderedIcon from '@lucide/svelte/icons/list-ordered';
  import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list';
  import DumbbellIcon from '@lucide/svelte/icons/dumbbell';
  import GaugeIcon from '@lucide/svelte/icons/gauge';
  import TypeIcon from '@lucide/svelte/icons/type';
  import AlignLeftIcon from '@lucide/svelte/icons/align-left';
  import TargetIcon from '@lucide/svelte/icons/target';
  import StickyNoteIcon from '@lucide/svelte/icons/sticky-note';
  import WeightIcon from '@lucide/svelte/icons/weight';
  import LayersIcon from '@lucide/svelte/icons/layers';
  import RepeatIcon from '@lucide/svelte/icons/repeat';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { WEEKDAYS, WORKOUT_DIFFICULTY_OPTIONS, WORKOUT_TYPE_OPTIONS } from '$lib/constants';

  let { data }: { data: PageData & { workoutForm: SuperValidated<Infer<WorkoutFormSchema>> } } = $props();

  let saveError = $state(false);
  let deleteRoutineDialogOpen = $state(false);
  let isDeleting = $state(false);
  let deleteDialogOpen = $state<boolean[]>([]);
  let deleteExerciseDialogOpen = $state<Record<string, boolean>>({});
  // svelte-ignore state_referenced_locally
  let exerciseNotesOpen = $state<Record<string, boolean>>(
    data.workoutForm.data.workout_days.reduce<Record<string, boolean>>((acc, day, dIdx) => {
      day.workout_exercises.forEach((ex, eIdx) => {
        if (ex.notes?.trim()) {
          acc[`${dIdx}-${eIdx}`] = true;
        }
      });
      return acc;
    }, {})
  );
  // svelte-ignore state_referenced_locally
  let dayNotesOpen = $state<Record<number, boolean>>(
    data.workoutForm.data.workout_days.reduce<Record<number, boolean>>((acc, day, dIdx) => {
      if (day.notes?.trim()) {
        acc[dIdx] = true;
      }
      return acc;
    }, {})
  );
  const weekdays = WEEKDAYS;
  const workoutTypeOptions = WORKOUT_TYPE_OPTIONS;
  const workoutDifficultyOptions = WORKOUT_DIFFICULTY_OPTIONS;

  const slugify = (value: string) => value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const getDayTitle = (index: number, usesNumberedDays: boolean) => {
    if (usesNumberedDays) {
      return `Day ${index + 1}`;
    }

    return weekdays[index % weekdays.length];
  };

  const workoutTypeLabel = $derived(
    workoutTypeOptions.find((option) => option.value === $formData.workout_type)?.label ?? 'Select workout type'
  );

  const workoutDifficultyLabel = $derived(
    workoutDifficultyOptions.find((option) => option.value === $formData.workout_difficulty)?.label ?? 'Select difficulty'
  );

  const setDeleteDialogOpen = (index: number, open: boolean) => {
    deleteDialogOpen[index] = open;
    deleteDialogOpen = deleteDialogOpen;
  };

  const getExerciseDialogKey = (dayIndex: number, exerciseIndex: number) => `${dayIndex}-${exerciseIndex}`;

  const setDeleteExerciseDialogOpen = (dayIndex: number, exerciseIndex: number, open: boolean) => {
    const key = getExerciseDialogKey(dayIndex, exerciseIndex);
    deleteExerciseDialogOpen = {
      ...deleteExerciseDialogOpen,
      [key]: open,
    };
  };

  const markDayForDeletion = (index: number) => {
    const dayId = $formData.workout_days[index]?.id;
    if (dayId) {
      $formData.deleted_day_ids.push(dayId);
    }
    $formData.workout_days.splice(index, 1);
    $formData = $formData;
    setDeleteDialogOpen(index, false);
  };

  const markExerciseForDeletion = (dayIndex: number, exerciseIndex: number) => {
    $formData.workout_days[dayIndex].workout_exercises.splice(exerciseIndex, 1);
    $formData = $formData;
    setDeleteExerciseDialogOpen(dayIndex, exerciseIndex, false);
  };

  // svelte-ignore state_referenced_locally
  const workoutForm = superForm(data.workoutForm, {
    validators: zod4Client(workoutFormSchema),
    dataType: 'json',
    resetForm: false,
    onSubmit: () => {
      saveError = false;
    },
    onUpdate: ({ form: f }) => {
      if (!f.valid) {
        toast.error('Please fix the errors in the form.');
      }
    },
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        workoutForm.tainted.set(undefined);
        toast.success('Workout routine saved successfully');
      }
    },
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success('Workout routine saved successfully');
        workoutForm.tainted.set(undefined);
      }
    },
    onError: () => {
      saveError = true;
    }
  });
  const { form: formData, enhance, submitting, tainted } = workoutForm;

  $effect(() => {
    if (!$tainted) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });

  beforeNavigate(({ cancel }) => {
    if ($submitting) return;
    if ($tainted && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      cancel();
    }
  });
</script>

<div class="w-full flex flex-col gap-8">
<div class="sticky top-0 z-20 -mx-5 flex flex-col gap-3 border-b border-border bg-background px-5 pt-4 pb-4 sm:-mx-14 sm:px-14 md:-mx-22 md:px-22 lg:hidden">
  {#if $tainted}
    <Alert.Root class="border border-border bg-secondary text-secondary-foreground shadow-sm [&>svg]:text-secondary-foreground">
      <TriangleAlertIcon />
      <Alert.Title>Unsaved changes</Alert.Title>
      <Alert.Description>You have unsaved changes.</Alert.Description>
    </Alert.Root>
  {:else}
    <Alert.Root>
      <CheckCircle2Icon />
      <Alert.Title>No unsaved changes</Alert.Title>
    </Alert.Root>
  {/if}
  <Button type="submit" form="workout-form" class="w-full" disabled={$submitting || !$tainted}>
    {#if $submitting}
      <Spinner />
    {/if}
    Save
  </Button>
  {#if saveError}
    <Alert.Root variant="destructive">
      <AlertCircleIcon />
      <Alert.Title>Something went wrong</Alert.Title>
      <Alert.Description>
        We encountered an issue while saving your workout routine. Please try again later.
      </Alert.Description>
    </Alert.Root>
  {/if}
</div>

<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_24rem]">
  <form id="workout-form" class="order-2 flex w-full flex-col gap-6 sm:gap-8 lg:order-1" method="POST" action="?/save" use:enhance>
    <div class="flex flex-col gap-5 rounded-4xl border border-border bg-card p-4 shadow-lg sm:p-6">
      <div class="flex items-center gap-3">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground shadow-sm">
          <ClipboardListIcon class="size-5" />
        </div>
        <div>
          <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Setup</p>
          <h2 class="text-2xl font-black">Basic Info</h2>
        </div>
      </div>

    <Form.Field form={workoutForm} name="name">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label class="flex items-center gap-1.5 text-sm font-black">
            <TypeIcon class="size-4 text-primary" />
            Workout Routine Name
          </Form.Label>
          <Input
            {...props}
            bind:value={$formData.name}
            placeholder="My Workout Routine"
            oninput={(event) => {
              $formData.slug = slugify((event.currentTarget as HTMLInputElement).value);
              $formData = $formData;
            }}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Collapsible.Root class="-mt-2 space-y-2">
      <Collapsible.Trigger
        type="button"
        class={buttonVariants({ variant: 'outline', size: 'sm', class: 'w-fit gap-1.5 px-3 text-xs' })}
      >
        View URL
        <ChevronDownIcon class="size-4" />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Form.Field form={workoutForm} name="slug">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Slug</Form.Label>
              <InputGroup.Root class="h-auto min-h-10 flex-wrap rounded-3xl sm:flex-nowrap sm:rounded-4xl">
                <InputGroup.Addon class="max-w-32 sm:max-w-none truncate text-xs sm:text-sm">yoursplit.com/{page.data.profile?.username}/</InputGroup.Addon>
                <InputGroup.Input class="min-w-0 text-xs sm:text-sm" {...props} bind:value={$formData.slug} placeholder="my-workout-routine" disabled />
              </InputGroup.Root>
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </Collapsible.Content>
    </Collapsible.Root>

    <Form.Field form={workoutForm} name="description">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label class="flex items-center gap-1.5 text-sm font-black">
            <AlignLeftIcon class="size-4 text-primary" />
            Description
          </Form.Label>
          <Textarea {...props} bind:value={$formData.description} placeholder="Enter a brief description of your workout routine" />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Form.Field form={workoutForm} name="workout_type">
        <Form.Control>
          {#snippet children()}
            <Form.Label class="flex items-center gap-1.5 text-sm font-black">
              <DumbbellIcon class="size-4 text-primary" />
              Workout Type
            </Form.Label>
            <Select.Root type="single" bind:value={$formData.workout_type}>
              <Select.Trigger class="w-full">{workoutTypeLabel}</Select.Trigger>
              <Select.Content>
                {#each workoutTypeOptions as option (option.value)}
                  <Select.Item value={option.value} label={option.label}>
                    {option.label}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field form={workoutForm} name="workout_difficulty">
        <Form.Control>
          {#snippet children()}
            <Form.Label class="flex items-center gap-1.5 text-sm font-black">
              <GaugeIcon class="size-4 text-primary" />
              Difficulty
            </Form.Label>
            <Select.Root type="single" bind:value={$formData.workout_difficulty}>
              <Select.Trigger class="w-full">{workoutDifficultyLabel}</Select.Trigger>
              <Select.Content>
                {#each workoutDifficultyOptions as option (option.value)}
                  <Select.Item value={option.value} label={option.label}>
                    {option.label}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </div>

  <div class="flex flex-col gap-5 rounded-4xl border border-border bg-card p-4 shadow-lg sm:p-6">
    <div class="flex items-center gap-3">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground shadow-sm">
        <CalendarDaysIcon class="size-5" />
      </div>
      <div>
        <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Training days</p>
        <h2 class="text-2xl font-black">Schedule</h2>
      </div>
    </div>

    <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        variant="outline"
        class="w-full sm:w-fit gap-2"
        onclick={() => {
          $formData.uses_numbered_days = !$formData.uses_numbered_days;
          $formData = $formData;
        }}
      >
        {#if $formData.uses_numbered_days}
          <CalendarDaysIcon class="size-4" />
          Use Weekdays
        {:else}
          <ListOrderedIcon class="size-4" />
          Use Numbered Days
        {/if}
      </Button>

      <Button class="w-full sm:w-fit gap-2" onclick={() => {
        $formData.workout_days.push({
          day_focus: undefined,
          marked_for_deletion: false,
          workout_exercises: []
        });
        $formData = $formData;
      }}>
        <PlusIcon class="size-4" />
        Add Day
      </Button>
    </div>

    <Accordion.Root class="rounded-4xl border border-border bg-background dark:bg-muted" type="single" value="0">
      {#each $formData.workout_days as day, index}
        <Accordion.Item value={index.toString()} class="border-b border-border last:border-b-0">
          <AccordionPrimitive.Header level={3} class="flex flex-wrap items-center gap-2 px-3 transition-colors hover:bg-muted/60 sm:flex-nowrap sm:px-4">
            <AccordionPrimitive.Trigger
              class="ring-offset-background focus-visible:border-ring focus-visible:ring-ring min-w-0 flex flex-1 items-center gap-3 rounded-3xl py-3 pr-1 text-left text-sm font-black outline-none transition-all hover:no-underline focus-visible:ring focus-visible:ring-offset-2 sm:py-4 sm:text-base [&>svg.chevron]:rotate-0 [&[data-state=open]>svg.chevron]:rotate-180"
            >
              <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-primary text-xs font-black text-primary-foreground shadow-sm sm:size-10 sm:text-sm">
                {#if $formData.uses_numbered_days}
                  {index + 1}
                {:else}
                  {weekdays[index % weekdays.length].slice(0, 3)}
                {/if}
              </span>
              <span class="min-w-0 flex-1 wrap-break-word">
                <span class="block">{getDayTitle(index, $formData.uses_numbered_days)}</span>
                {#if day.day_focus?.trim()}
                  <span class="block text-xs font-bold text-muted-foreground wrap-break-word sm:text-sm">{day.day_focus}</span>
                {:else}
                  <span class="block text-xs font-bold text-muted-foreground/70 sm:text-sm">
                    {day.workout_exercises.length} {day.workout_exercises.length === 1 ? 'exercise' : 'exercises'}
                  </span>
                {/if}
              </span>
              <ChevronDownIcon
                class="chevron text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200"
              />
            </AccordionPrimitive.Trigger>

            <AlertDialog.Root
              open={deleteDialogOpen[index] ?? false}
              onOpenChange={(open) => setDeleteDialogOpen(index, open)}
            >
              <AlertDialog.Trigger
                type="button"
                class={buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  class: 'shrink-0 text-destructive hover:bg-destructive hover:text-primary-foreground',
                })}
                aria-label={`Delete ${getDayTitle(index, $formData.uses_numbered_days)}`}
              >
                <Trash2Icon class="size-4" />
                <span class="hidden sm:inline">Delete</span>
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title>Delete {getDayTitle(index, $formData.uses_numbered_days)}?</AlertDialog.Title>
                  <AlertDialog.Description>
                    This day will be removed when you save the workout routine.
                  </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
                  <AlertDialog.Action
                    type="button"
                    variant="destructive"
                    onclick={() => {
                      markDayForDeletion(index);
                    }}
                  >
                    Delete
                  </AlertDialog.Action>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </AccordionPrimitive.Header>

          <Accordion.Content class="flex flex-col gap-4 px-3 pb-5 pt-2 sm:px-4">
            <Form.Field form={workoutForm} name="workout_days[{index}].day_focus">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label class="flex items-center gap-1.5 text-sm font-black">
                    <TargetIcon class="size-4 text-primary" />
                    Daily Focus
                  </Form.Label>
                  <Input {...props} placeholder="e.g. Push, Pull, Legs" bind:value={$formData.workout_days[index].day_focus} />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Collapsible.Root
              open={dayNotesOpen[index] ?? false}
              onOpenChange={(v) => (dayNotesOpen = { ...dayNotesOpen, [index]: v })}
            >
              {#if !(dayNotesOpen[index] ?? false)}
                <Collapsible.Trigger
                  type="button"
                  class={buttonVariants({ variant: 'outline', size: 'sm', class: 'w-full gap-1.5 sm:w-fit' })}
                >
                  <StickyNoteIcon class="size-4" />
                  Add day notes
                </Collapsible.Trigger>
              {/if}
              <Collapsible.Content>
                <Form.Field form={workoutForm} name="workout_days[{index}].notes">
                  <Form.Control>
                    {#snippet children({ props })}
                      <Form.Label class="flex items-center gap-1.5 text-sm font-black">
                        <StickyNoteIcon class="size-4 text-primary" />
                        Day Notes
                      </Form.Label>
                      <Textarea {...props} bind:value={$formData.workout_days[index].notes} placeholder="Optional notes for this day" />
                    {/snippet}
                  </Form.Control>
                  <Form.FieldErrors />
                </Form.Field>
              </Collapsible.Content>
            </Collapsible.Root>

            <div class="flex items-center justify-between gap-2 border-t border-border pt-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Exercises</p>
                <p class="text-sm font-black">{$formData.workout_days[index].workout_exercises.length} added</p>
              </div>
              <Button class="gap-1.5" onclick={() => {
                $formData.workout_days[index].workout_exercises.push({
                  name: '',
                  weight: undefined,
                  sets: 4,
                  reps: 10,
                  notes: undefined,
                });
                $formData = $formData;
              }}>
                <PlusIcon class="size-4" />
                Add Exercise
              </Button>
            </div>

            {#if $formData.workout_days[index].workout_exercises.length === 0}
              <div class="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-background px-4 py-8 text-center dark:bg-background">
                <DumbbellIcon class="size-6 text-muted-foreground" />
                <p class="text-sm font-bold text-muted-foreground">No exercises added yet.</p>
              </div>
            {/if}

            {#each $formData.workout_days[index].workout_exercises as exercise, eIndex}
              {@const exerciseKey = getExerciseDialogKey(index, eIndex)}
              <div class="flex flex-col gap-4 rounded-4xl border border-border bg-card p-4 shadow-md dark:bg-card sm:p-5">
                <div class="flex flex-wrap items-start gap-3">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground shadow-sm">
                    <DumbbellIcon class="size-5" />
                  </div>

                  <Form.Field form={workoutForm} name="workout_days[{index}].workout_exercises[{eIndex}].name" class="order-last w-full min-w-0 space-y-1 sm:order-none sm:w-auto sm:flex-1">
                    <Form.Control>
                      {#snippet children({ props })}
                        <Form.Label class="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                          Exercise Name
                        </Form.Label>
                        <Input {...props} placeholder="e.g. Bench Press" class="font-bold" bind:value={$formData.workout_days[index].workout_exercises[eIndex].name} />
                      {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>

                  <AlertDialog.Root
                    open={deleteExerciseDialogOpen[exerciseKey] ?? false}
                    onOpenChange={(open) => setDeleteExerciseDialogOpen(index, eIndex, open)}
                  >
                    <AlertDialog.Trigger
                      type="button"
                      class={buttonVariants({
                        variant: 'outline',
                        size: 'icon-sm',
                        class: 'ml-auto shrink-0 text-destructive hover:bg-destructive hover:text-primary-foreground sm:ml-0 sm:mt-5',
                      })}
                      aria-label={`Delete ${exercise.name?.trim() || 'exercise'}`}
                    >
                      <Trash2Icon class="size-4" />
                    </AlertDialog.Trigger>
                    <AlertDialog.Content>
                      <AlertDialog.Header>
                        <AlertDialog.Title>Delete this exercise?</AlertDialog.Title>
                        <AlertDialog.Description>
                          This exercise will be removed when you save the workout routine.
                        </AlertDialog.Description>
                      </AlertDialog.Header>
                      <AlertDialog.Footer>
                        <AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action
                          type="button"
                          variant="destructive"
                          onclick={() => {
                            markExerciseForDeletion(index, eIndex);
                          }}
                        >
                          Delete
                        </AlertDialog.Action>
                      </AlertDialog.Footer>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                </div>

                <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  <div class="col-span-2 flex flex-col gap-1.5 rounded-3xl border border-border bg-background p-3 dark:bg-muted sm:col-span-1">
                    <Form.Field form={workoutForm} name="workout_days[{index}].workout_exercises[{eIndex}].weight" class="space-y-1.5">
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label class="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                            <WeightIcon class="size-3 text-primary" />
                            Weight
                          </Form.Label>
                          <Input
                            {...props}
                            type="number"
                            placeholder="—"
                            class="h-9 px-2 text-base font-black"
                            bind:value={$formData.workout_days[index].workout_exercises[eIndex].weight}
                          />
                          <div class="flex items-center justify-between gap-1 text-[10px] font-bold text-muted-foreground">
                            <span>lbs</span>
                            {#if $formData.workout_days[index].workout_exercises[eIndex].weight !== undefined}
                              <button
                                type="button"
                                class="underline transition-colors hover:text-foreground"
                                onclick={() => {
                                  $formData.workout_days[index].workout_exercises[eIndex].weight = undefined;
                                  $formData = $formData;
                                }}
                              >Clear</button>
                            {/if}
                          </div>
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>
                  </div>

                  <div class="flex flex-col gap-1.5 rounded-3xl border border-border bg-background p-3 dark:bg-muted">
                    <Form.Field form={workoutForm} name="workout_days[{index}].workout_exercises[{eIndex}].sets" class="space-y-1.5">
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label class="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                            <LayersIcon class="size-3 text-primary" />
                            Sets
                          </Form.Label>
                          <Input {...props} type="number" class="h-9 px-2 text-base font-black" bind:value={$formData.workout_days[index].workout_exercises[eIndex].sets} />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>
                  </div>

                  <div class="flex flex-col gap-1.5 rounded-3xl border border-border bg-background p-3 dark:bg-muted">
                    <Form.Field form={workoutForm} name="workout_days[{index}].workout_exercises[{eIndex}].reps" class="space-y-1.5">
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label class="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                            <RepeatIcon class="size-3 text-primary" />
                            Reps
                          </Form.Label>
                          <Input {...props} type="number" class="h-9 px-2 text-base font-black" bind:value={$formData.workout_days[index].workout_exercises[eIndex].reps} />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>
                  </div>
                </div>

                <Collapsible.Root
                  open={exerciseNotesOpen[exerciseKey] ?? false}
                  onOpenChange={(v) => (exerciseNotesOpen = { ...exerciseNotesOpen, [exerciseKey]: v })}
                >
                  {#if !(exerciseNotesOpen[exerciseKey] ?? false)}
                    <Collapsible.Trigger
                      type="button"
                      class={buttonVariants({ variant: 'outline', size: 'sm', class: 'w-full gap-1.5 sm:w-fit' })}
                    >
                      <StickyNoteIcon class="size-4" />
                      Add notes
                    </Collapsible.Trigger>
                  {/if}
                  <Collapsible.Content>
                    <Form.Field form={workoutForm} name="workout_days[{index}].workout_exercises[{eIndex}].notes">
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label class="flex items-center gap-1.5 text-sm font-black">
                            <StickyNoteIcon class="size-4 text-primary" />
                            Exercise Notes
                          </Form.Label>
                          <Textarea {...props} bind:value={$formData.workout_days[index].workout_exercises[eIndex].notes} placeholder="Optional cues, tempo, rest time, or substitutions" />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            {/each}
          </Accordion.Content>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  </div>

  </form>

  <aside class="order-1 flex w-full flex-col gap-4 lg:order-2 lg:sticky lg:top-8 lg:self-start">
    <div class="hidden lg:flex flex-col gap-3">
      {#if $tainted}
        <Alert.Root class="border border-border bg-secondary text-secondary-foreground shadow-sm [&>svg]:text-secondary-foreground">
          <TriangleAlertIcon />
          <Alert.Title>Unsaved changes</Alert.Title>
          <Alert.Description>You have unsaved changes.</Alert.Description>
        </Alert.Root>
      {:else}
        <Alert.Root class="border border-border shadow-sm">
          <CheckCircle2Icon />
          <Alert.Title>No unsaved changes</Alert.Title>
        </Alert.Root>
      {/if}
      <Button type="submit" form="workout-form" class="w-full" disabled={$submitting || !$tainted}>
        {#if $submitting}
          <Spinner />
        {/if}
        Save
      </Button>
      {#if saveError}
        <Alert.Root variant="destructive">
          <AlertCircleIcon />
          <Alert.Title>Something went wrong</Alert.Title>
          <Alert.Description>
            We encountered an issue while saving your workout routine. Please try again later.
          </Alert.Description>
        </Alert.Root>
      {/if}
    </div>
    <ChatSidebar form={workoutForm} />
  </aside>

  <div class="order-3 flex flex-col gap-4">
    <AlertDialog.Root
      open={deleteRoutineDialogOpen}
      onOpenChange={(open) => {
        deleteRoutineDialogOpen = open;
      }}
    >
      <AlertDialog.Trigger type="button" class={['w-full sm:w-fit', buttonVariants({ variant: 'destructive' })]}>
        Delete Routine
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete this routine?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. Your routine and all of its days and exercises will be permanently deleted.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
          <form method="POST" action="?/delete" use:formEnhance={() => {
            isDeleting = true;
            return async ({ update }) => {
              isDeleting = false;
              deleteRoutineDialogOpen = false;
              update();
            };
          }}>
            <AlertDialog.Action type="submit" variant="destructive" disabled={isDeleting}>
              {#if isDeleting}
                <Spinner />
              {/if}
              Delete Routine
            </AlertDialog.Action>
          </form>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>

  </div>
</div></div>
