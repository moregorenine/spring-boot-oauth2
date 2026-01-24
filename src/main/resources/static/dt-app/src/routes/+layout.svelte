<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { locales, localizeHref } from '$lib/paraglide/runtime';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { authStore } from '$lib/stores/auth.svelte';
  import '$lib/config/axios.config'; // Axios interceptor 초기화
  import '../app.css';

  let { children } = $props();

  // 라우트 정의 - 새로운 페이지 추가 시 여기에만 추가하면 됩니다
  const routes = [
    { path: '/about', label: 'About' },
    { path: '/demo', label: 'Demo' },
    { path: '/items', label: 'Items' },
    { path: '/reference', label: 'Reference' },
    { path: '/references', label: 'References' },
    { path: '/tabulator', label: 'Tabulator' },
    { path: '/window-demo', label: 'Window Demo' },
    { path: '/quill-demo', label: 'Quill Demo' },
    { path: '/login', label: 'Login' }
  ];

  // 현재 경로에 맞는 라우트 찾기
  const currentRoute = $derived.by(() => {
    const pathname = page.url.pathname;

    // 홈 페이지 체크
    if (pathname === '/' || pathname === base + '/') {
      return { path: '/', label: 'Home', isHome: true };
    }

    // 다른 라우트 찾기
    const route = routes.find((r) => pathname.includes(r.path));
    return route || { path: pathname, label: 'Page', isHome: false };
  });

  // 앱 초기화 시 localStorage에서 인증 정보 복원
  onMount(() => {
    authStore.loadFromStorage();
  });
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header
      class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {#if currentRoute.isHome}
              <Breadcrumb.Item>
                <Breadcrumb.Page>Home</Breadcrumb.Page>
              </Breadcrumb.Item>
            {:else}
              <Breadcrumb.Item class="hidden md:block">
                <Breadcrumb.Link href={base + '/'}>Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="hidden md:block" />
              <Breadcrumb.Item>
                <Breadcrumb.Page>{currentRoute.label}</Breadcrumb.Page>
              </Breadcrumb.Item>
            {/if}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
