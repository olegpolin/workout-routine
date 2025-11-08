<script lang="ts">
  import * as Item from '$lib/components/ui/item';
  import * as Avatar from '$lib/components/ui/avatar';
  import UserIcon from '@lucide/svelte/icons/user';

  interface Props {
    class?: string;
    profile: {
			username: string;
			full_name: string | null;
			avatar_url: string | null;
		} | null;
  }

  let { class: className, profile }: Props = $props();
</script>

<Item.Root class={className}>
  <Item.Media>
    <Avatar.Root>
      <Avatar.Image src={profile?.avatar_url} alt="Profile picture" />
      <Avatar.Fallback>
        <UserIcon />
      </Avatar.Fallback>
    </Avatar.Root>
  </Item.Media>
  <Item.Content class="gap-1">
    <Item.Title>{profile?.full_name ?? 'Unknown User'}</Item.Title>
    <Item.Description>@{profile?.username ?? 'unknown-user'}</Item.Description>
  </Item.Content>
</Item.Root>
