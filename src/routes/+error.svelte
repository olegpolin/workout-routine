<script lang="ts">
  import { page } from '$app/state';
  import Seo from '$lib/components/seo.svelte';
  import { Button } from '$lib/components/ui/button';
  import HomeIcon from '@lucide/svelte/icons/home';
  import SearchIcon from '@lucide/svelte/icons/search';
  import DumbbellIcon from '@lucide/svelte/icons/dumbbell';

  const friendlyMessage = $derived(
    page.status === 404
      ? "Looks like this routine wandered off to the gym."
      : "Even the strongest lifters miss a rep. Let's reset and try again."
  );
</script>

<Seo title={`${page.status}`} />

<div class="my-auto flex w-full flex-col items-center justify-center px-2 py-10">
  <div class="flex w-full max-w-2xl flex-col gap-5 rounded-4xl border border-border bg-card p-6 text-center shadow-lg sm:p-10">
    <div class="mx-auto flex size-16 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground shadow-md">
      <DumbbellIcon class="size-8" />
    </div>
    <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Error {page.status}</p>
    <h1 class="text-4xl font-black tracking-tight text-foreground sm:text-6xl">
      {page.status === 404 ? 'Page not found' : 'Something broke'}
    </h1>
    <p class="text-base font-semibold leading-7 text-muted-foreground sm:text-lg">
      {friendlyMessage}
    </p>
    {#if page.error?.message && page.error.message !== 'Not Found'}
      <p class="text-sm font-bold text-muted-foreground">{page.error.message}</p>
    {/if}
    <div class="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
      <Button href="/" size="lg">
        <HomeIcon class="size-5" />
        Go Home
      </Button>
      <Button href="/browse" size="lg" variant="secondary">
        <SearchIcon class="size-5" />
        Browse Routines
      </Button>
    </div>
  </div>
</div>
