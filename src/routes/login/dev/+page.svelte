<script lang="ts">
  import type { PageProps } from './$types';
  import Seo from '$lib/components/seo.svelte';
  import LoginForm from './login-form.svelte';
  import * as Card from '$lib/components/ui/card';

  let { data }: PageProps = $props();
</script>

<Seo title="Login" />

<div class="flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center px-2 py-8 sm:px-6 sm:py-12 lg:px-8">
  <Card.Root class="w-full max-w-md">
    <Card.Header class="space-y-1 mt-4">
      <p class="text-center text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Dev login</p>
      <Card.Title class="text-3xl font-black tracking-tight text-center text-foreground">Welcome back</Card.Title>
      <Card.Description class="pt-2 text-center font-semibold text-muted-foreground">
        Sign in with email and password (development only)
      </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4 mt-4 mb-4 pb-6">
      <LoginForm {data} />
    </Card.Content>
  </Card.Root>
</div>
