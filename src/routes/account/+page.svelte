<script lang="ts">
  import type { PageProps } from './$types';
  import AccountForm from './account-form.svelte';
  import SignoutForm from './signout-form.svelte';

  let { data }: PageProps = $props();
</script>

<div class="flex flex-col items-center gap-8 my-auto">
  <div class="flex flex-col items-center gap-4">
    <h1 class="text-4xl text-center font-semibold">Your Profile</h1>
    <p class="text-center text-muted-foreground">Manage your account information</p>
  </div>

  <div class="w-full max-w-96 flex flex-col gap-8">
    <AccountForm {data} />

    <SignoutForm {data} />
  </div>
</div>
