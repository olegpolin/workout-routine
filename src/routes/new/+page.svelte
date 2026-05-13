<script lang="ts">
  import { enhance } from '$app/forms';
  import Seo from '$lib/components/seo.svelte';
  import { Button } from '$lib/components/ui/button';

  let isCreating = $state(false);

  const enhanceCreateRoutine = () => {
    isCreating = true;

    return async ({ update }: { update: () => Promise<void> }) => {
      await update();
      isCreating = false;
    };
  };
</script>

<Seo title="New Workout Routine" />

<section class="mx-auto my-auto flex min-h-136 w-full max-w-3xl flex-col items-center justify-center gap-8 px-4 py-10 text-center sm:gap-10 sm:px-6 sm:py-14">
  <div class="w-full rounded-4xl border border-border bg-card p-6 text-left shadow-lg sm:p-8">
    <p class="text-sm font-black uppercase tracking-[0.18em] text-primary">New Routine</p>
    <h1 class="mt-3 text-4xl font-black tracking-tight text-foreground sm:text-6xl">Create. Save. <span class="text-primary">Share.</span></h1>
    <p class="mt-4 max-w-lg text-base font-semibold leading-7 text-muted-foreground sm:text-lg">Create and save a workout routine to never forget your split.</p>
  </div>

  <form method="POST" action="?/create" use:enhance={enhanceCreateRoutine} class="flex h-32 items-center justify-center">
    <div class={isCreating ? 'create-button-shake' : ''}>
      <Button
        type="submit"
        size="lg"
        disabled={isCreating}
        class="px-6 text-base sm:h-14 sm:px-8 sm:text-lg"
      >
        {isCreating ? 'Creating...' : 'Create Workout Routine'}
      </Button>
    </div>
  </form>
</section>

<style>
  .create-button-shake {
    animation: create-button-shake 0.45s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .create-button-shake {
      animation: none;
    }
  }

  @keyframes create-button-shake {
    0%,
    100% {
      transform: translateX(0);
    }

    25% {
      transform: translateX(-2px) rotate(-1deg);
    }

    75% {
      transform: translateX(2px) rotate(1deg);
    }
  }
</style>
