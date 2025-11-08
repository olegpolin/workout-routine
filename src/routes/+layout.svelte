<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { onMount } from 'svelte';
  import { invalidate } from '$app/navigation';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner';
  import Header from '$lib/components/header.svelte';
  import Footer from '$lib/components/footer.svelte';

  let { children, data } = $props();
  let { supabase, session } = $derived(data);

  onMount(() => {
    const { data: authData } = supabase.auth.onAuthStateChange((authEvent, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => authData.subscription.unsubscribe();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher defaultMode="dark" />

<Toaster richColors />

<div class="min-h-screen max-w-7xl flex flex-col mx-auto">
  <Header />

  <main class="grow flex flex-col px-8 md:px-16 py-8">
    {@render children?.()}
  </main>

  <Footer />
</div>
