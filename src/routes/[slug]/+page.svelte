<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from '$lib/components/ui/button';
  import * as Avatar from '$lib/components/ui/avatar';
  import * as Empty from '$lib/components/ui/empty';
  import UserIcon from '@lucide/svelte/icons/user';

  let { data }: PageProps = $props();
</script>

<div class="flex flex-col gap-16 my-auto">
  <div class="flex flex-col md:flex-row gap-16">
    <div class="md:basis-1/2 flex flex-col items-center gap-4">
      <Avatar.Root class="size-16">
        <Avatar.Image src={data.userProfile.avatar_url} alt="Profile picture" />
        <Avatar.Fallback>
          <UserIcon />
        </Avatar.Fallback>
      </Avatar.Root>
      <h1 class="text-2xl text-center font-semibold">{data.userProfile.full_name}</h1>
      <p class="text-lg text-muted-foreground text-center">@{data.userProfile.username}</p>
    </div>

    <Empty.Root class="md:basis-1/2">
      <Empty.Header>
        <Empty.Title>No content</Empty.Title>
        <Empty.Description>This user has no content</Empty.Description>
      </Empty.Header>
    </Empty.Root>
  </div>

  {#if data.profile?.username === data.userProfile.username}
    <div class="flex justify-center">
      <Button href="/account">
        Edit profile
      </Button>
    </div>
  {/if}
</div>
