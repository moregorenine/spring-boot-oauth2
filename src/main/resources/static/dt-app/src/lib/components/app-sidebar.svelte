<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Database,
    FileText,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal
  } from '@lucide/svelte';
  import NavMain from './nav-main.svelte';
  import NavProjects from './nav-projects.svelte';
  import NavUser from './nav-user.svelte';
  import TeamSwitcher from './team-switcher.svelte';
  import ThemeSelector from './theme-selector.svelte';
  import { Separator } from '$lib/components/ui/separator/index.js';

  // This is sample data.
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: ''
    },
    teams: [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise'
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup'
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free'
      }
    ],
    navMain: [
      {
        title: 'Playground',
        url: '#',
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: 'History',
            url: '#'
          },
          {
            title: 'Starred',
            url: '#'
          },
          {
            title: 'Settings',
            url: '#'
          }
        ]
      },
      {
        title: 'Models',
        url: '#',
        icon: Bot,
        items: [
          {
            title: 'Genesis',
            url: '#'
          },
          {
            title: 'Explorer',
            url: '#'
          },
          {
            title: 'Quantum',
            url: '#'
          }
        ]
      },
      {
        title: 'Documentation',
        url: '#',
        icon: BookOpen,
        items: [
          {
            title: 'Introduction',
            url: '#'
          },
          {
            title: 'Get Started',
            url: '#'
          },
          {
            title: 'Tutorials',
            url: '#'
          },
          {
            title: 'Changelog',
            url: '#'
          }
        ]
      },
      {
        title: 'Settings',
        url: '#',
        icon: Settings2,
        items: [
          {
            title: 'General',
            url: '#'
          },
          {
            title: 'Team',
            url: '#'
          },
          {
            title: 'Billing',
            url: '#'
          },
          {
            title: 'Limits',
            url: '#'
          }
        ]
      }
    ],
    projects: [
      {
        name: 'Home',
        url: '/',
        icon: Frame
      },
      {
        name: 'About',
        url: '/about',
        icon: PieChart
      },
      {
        name: 'Demo',
        url: '/demo',
        icon: Map
      },
      {
        name: 'Items',
        url: '/items',
        icon: Database
      },
      {
        name: 'Reference',
        url: '/reference',
        icon: FileText
      },
      {
        name: 'References',
        url: '/references',
        icon: Database
      },
      {
        name: 'Tabulator',
        url: '/tabulator',
        icon: SquareTerminal
      },
      {
        name: 'Window Demo',
        url: '/window-demo',
        icon: Frame
      },
      {
        name: 'Quill Demo',
        url: '/quill-demo',
        icon: BookOpen
      }
    ]
  };
  let { ...props } = $props();
</script>

<Sidebar.Root collapsible="icon" {...props}>
  <Sidebar.Header>
    <TeamSwitcher teams={data.teams} />
  </Sidebar.Header>
  <Sidebar.Content>
    <NavMain items={data.navMain} />
    <NavProjects projects={data.projects} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <ThemeSelector />
    <Separator class="my-2" />
    <NavUser user={data.user} />
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
