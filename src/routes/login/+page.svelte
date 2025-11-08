<script lang="ts">
  import type { PageProps } from './$types';
  import GoogleLoginForm from './google-login-form.svelte';

  let { data }: PageProps = $props();
</script>

<div class="flex flex-col items-center gap-8 my-auto">
  <div class="flex flex-col items-center gap-4">
    <h1 class="text-4xl text-center font-semibold">Log in</h1>
    <p class="text-center text-muted-foreground">An account will be created if you're new</p>
  </div>

  <div class="w-full max-w-72">
    <GoogleLoginForm {data} />
  </div>
</div>
