<script lang="ts">
  import type { PageProps } from './$types';
  import Seo from '$lib/components/seo.svelte';
  import AccountForm from './account-form.svelte';
  import SignoutForm from './signout-form.svelte';
  import * as Card from '$lib/components/ui/card';

  let { data }: PageProps = $props();
</script>

<Seo title="Account" />

<div class="container mx-auto max-w-2xl px-2 py-8 sm:px-4 sm:py-12 md:px-6">
  <div class="flex w-full flex-col items-center gap-8">
    <div class="flex w-full flex-col gap-3 rounded-4xl border border-border bg-card p-5 text-left shadow-lg sm:p-8">
      <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Profile control</p>
      <h1 class="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
        Account <span class="text-primary">Settings</span>
      </h1>
      <p class="max-w-md text-base font-semibold leading-7 text-muted-foreground sm:text-lg">
        Manage your profile information and preferences
      </p>
    </div>

    <Card.Root class="w-full overflow-hidden">
      <Card.Content class="p-6 sm:p-8">
        <div class="w-full flex gap-3 flex-col">
          <h2 class="text-2xl font-black text-foreground tracking-tight">Profile Details</h2>
          <AccountForm {data} />
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root class="w-full overflow-hidden border-destructive/40">
      <Card.Content class="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-black text-destructive tracking-tight">Danger Zone</h2>
          <p class="text-sm font-semibold text-muted-foreground">Log out of your current session.</p>
        </div>
        <div class="w-full sm:w-auto">
          <SignoutForm {data} />
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>

