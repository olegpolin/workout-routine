<script lang="ts">
  import type { PageProps } from './$types';
  import LoginForm from './login-form.svelte';

  let { data }: PageProps = $props();
</script>

<div class="flex flex-col items-center gap-8 my-auto">
  <h1 class="text-4xl text-center font-semibold">Log in</h1>

  <div class="w-full max-w-72">
    <LoginForm {data} />
  </div>
</div>
