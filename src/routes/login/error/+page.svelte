<script lang="ts">
  import Seo from '$lib/components/seo.svelte';
  import { Button } from '$lib/components/ui/button';
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
</script>

<Seo title="Login Error" />

<div class="my-auto flex w-full flex-col items-center justify-center px-2 py-10">
  <div class="flex w-full max-w-md flex-col gap-5 rounded-4xl border border-border bg-card p-6 text-center shadow-lg sm:p-10">
    <div class="mx-auto flex size-14 items-center justify-center rounded-full border border-border bg-destructive text-primary-foreground shadow-md">
      <TriangleAlertIcon class="size-7" />
    </div>
    <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Login error</p>
    <h1 class="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
      Something went wrong
    </h1>
    <p class="text-base font-semibold leading-7 text-muted-foreground">
      We hit a snag while logging you in. Please try again in a moment.
    </p>
    <div class="mt-2 flex justify-center">
      <Button size="lg" href="/login">
        <ArrowLeftIcon class="size-5" />
        Back to Login
      </Button>
    </div>
  </div>
</div>
