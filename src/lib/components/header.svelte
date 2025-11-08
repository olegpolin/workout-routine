<script lang="ts">
  import { page } from '$app/state';
  import * as NavigationMenu from '$lib/components/ui/navigation-menu';
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Avatar from '$lib/components/ui/avatar';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import ProfileCard from '$lib/components/profile-card.svelte';
  import DumbbellIcon from '@lucide/svelte/icons/dumbbell';
  import MenuIcon from '@lucide/svelte/icons/menu';
  import UserIcon from '@lucide/svelte/icons/user';

  const navMenuLinks = [
    {
      title: 'Home',
      href: '/'
    },
    {
      title: 'Workout Routines',
      href: '/workout-routines'
    }
  ];

  let accountMenuLinks = $derived([
    {
      title: 'Profile',
      href: `/${page.data.profile?.username ?? 'account'}`
    },
    {
      title: 'Account Settings',
      href: '/account'
    }
  ]);
</script>

<header class="w-full flex flex-row items-center justify-between gap-4 p-4">
  <div class="md:basis-1/3">
    <a class="inline-flex items-center gap-2 text-2xl font-semibold" href="/">
      <DumbbellIcon class="text-blue-500" />
      Workout Routine
    </a>
  </div>

  <NavigationMenu.Root class="md:basis-1/3 max-md:hidden">
    <NavigationMenu.List>
      {#each navMenuLinks as link}
        <NavigationMenu.Item>
          <NavigationMenu.Link>
            {#snippet child()}
              <a href={link.href} class={navigationMenuTriggerStyle()}>{link.title}</a>
            {/snippet}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {/each}
    </NavigationMenu.List>
  </NavigationMenu.Root>

  <div class="md:basis-1/3 flex justify-end">
    {#if !page.data.session}
      <Button class="max-md:hidden" href="/login" variant="secondary">
        Log in
      </Button>
    {:else}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="max-md:hidden">
          <Avatar.Root>
            <Avatar.Image src={page.data.profile?.avatar_url} alt="Profile picture" />
            <Avatar.Fallback>
              <UserIcon />
            </Avatar.Fallback>
          </Avatar.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Group>
            <DropdownMenu.Label>
              <ProfileCard class="p-0" profile={page.data.profile} />
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            {#each accountMenuLinks as link}
              <a href={link.href}>
                <DropdownMenu.Item>{link.title}</DropdownMenu.Item>
              </a>
            {/each}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    {/if}

    <Sheet.Root>
      <Sheet.Trigger class="md:hidden">
        <MenuIcon />
      </Sheet.Trigger>
      <Sheet.Content>
        <nav class="h-full p-2">
          <ul class="h-full flex flex-col justify-center gap-4">
            {#each navMenuLinks as link}
              <li>
                <a href={link.href}>
                  <Sheet.Close
                    class={['w-full justify-start', buttonVariants({ variant: 'ghost' })]}
                  >
                    {link.title}
                  </Sheet.Close>
                </a>
              </li>
            {/each}

            {#if !page.data.session}
              <li>
                <a href="/login">
                  <Sheet.Close
                    class={['w-full justify-start', buttonVariants({ variant: 'ghost' })]}
                  >
                    Log in
                  </Sheet.Close>
                </a>
              </li>
            {:else}
              <ProfileCard profile={page.data.profile} />
              {#each accountMenuLinks as link}
                <li>
                  <a href={link.href}>
                    <Sheet.Close
                      class={['w-full justify-start', buttonVariants({ variant: 'ghost' })]}
                    >
                      {link.title}
                    </Sheet.Close>
                  </a>
                </li>
              {/each}
            {/if}
          </ul>
        </nav>
      </Sheet.Content>
    </Sheet.Root>
  </div>
</header>
