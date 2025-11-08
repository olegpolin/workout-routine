<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
</script>

<div class="flex flex-col items-center gap-8 my-auto">
  <div class="flex flex-col items-center gap-4">
    <h1 class="text-4xl text-center font-semibold">Something went wrong</h1>
    <p class="text-center text-muted-foreground">
      Sorry, we encountered an error while logging you in.
      <br />
      Please try again later.
    </p>
  </div>

  <Button size="lg" href="/login">
    <ArrowLeftIcon />
    Back to Login
  </Button>
</div>
