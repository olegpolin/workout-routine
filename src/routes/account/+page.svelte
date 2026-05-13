<script lang="ts">
  import type { PageProps } from './$types';
  import Seo from '$lib/components/seo.svelte';
  import AccountForm from './account-form.svelte';
  import SignoutForm from './signout-form.svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Separator from '$lib/components/ui/separator';

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
        <div class="w-full flex gap-3 flex-col mb-8">
          <h2 class="text-2xl font-black text-foreground tracking-tight">Profile Details</h2>
          <AccountForm {data} />
        </div>
        
        <Separator.Root class="my-8 bg-border/60" />
        
        <div class="w-full flex flex-col items-center text-center gap-3">
          <h2 class="text-xl font-black text-destructive tracking-tight">Danger Zone</h2>
          <p class="text-sm text-muted-foreground mb-4">Log out of your current session.</p>
          <div class="w-40">
            <SignoutForm {data} />
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>

