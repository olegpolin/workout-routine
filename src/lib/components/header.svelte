<script lang="ts">
  import { page } from '$app/state';
  import * as NavigationMenu from '$lib/components/ui/navigation-menu';
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Avatar from '$lib/components/ui/avatar';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import ProfileCard from '$lib/components/profile-card.svelte';
  import favicon from '$lib/assets/favicon.svg';
  import MenuIcon from '@lucide/svelte/icons/menu';
  import UserIcon from '@lucide/svelte/icons/user';

  const navMenuLinks = [
    {
      title: 'Browse',
      href: '/browse'
    },
    {
      title: 'Create Routine',
      href: '/new'
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

<header class="w-full flex flex-row items-center justify-between gap-4 py-4 px-2">
  <a class="group/logo flex items-center gap-3 rounded-3xl px-2 py-1 -mx-2 -my-1 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-2" href="/">
    <div class="flex size-8 items-center justify-center overflow-hidden">
      <img src={favicon} alt="YourSplit logo" class="size-8 transition-transform group-hover/logo:rotate-[-6deg]" />
    </div>
    <span class="text-2xl font-black tracking-tight text-foreground">
      YourSplit
    </span>
  </a>

  <div class="flex items-center gap-4">
    <Button variant="outline" class="hidden md:flex" href="/browse">
      Browse
    </Button>
    <Button class="hidden md:flex" href="/new">
      Create Routine
    </Button>

    {#if !page.data.session}
      <Button class="max-md:hidden" href="/login" variant="secondary">
        Log in
      </Button>
    {:else}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="max-md:hidden rounded-full transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Account menu"
        >
          <Avatar.Root class="size-10 border border-border shadow-sm">
            <Avatar.Image src={page.data.profile?.avatar_url} alt="Profile picture" />
            <Avatar.Fallback class="bg-muted"><UserIcon class="size-5 text-muted-foreground" /></Avatar.Fallback>
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
      <Sheet.Trigger
        class={[buttonVariants({ variant: 'outline', size: 'icon' }), 'md:hidden']}
        aria-label="Menu"
      >
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
