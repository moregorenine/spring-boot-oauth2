<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { apiGet } from '$lib/api';
  import Counter from './Counter.svelte';
  import welcome from '$lib/images/svelte-welcome.webp';
  import welcomeFallback from '$lib/images/svelte-welcome.png';
  import { Button } from '$lib/components/ui/button';

  let user = $state(null);
  let loading = $state(true);
  let authenticated = $state(false);

  onMount(async () => {
    // auth store 구독
    auth.subscribe((state) => {
      user = state.user;
      loading = state.loading;
      authenticated = state.authenticated;
    });
  });

  async function handleLogout() {
    await auth.logout();
  }

  function handleLogin() {
    window.location.href = '/oauth2/authorization/google';
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  {#if loading}
    <div class="loading-container">
      <p>로딩 중...</p>
    </div>
  {:else if authenticated && user}
    <div class="user-info">
      <h1>환영합니다, {user.name}님!</h1>
      <p class="email">{user.email}</p>

      <div class="actions">
        <Button on:click={handleLogout} variant="destructive">로그아웃</Button>
      </div>

      {#if user.picture}
        <div class="user-picture">
          <img src={user.picture} alt="Profile" />
        </div>
      {/if}

      <details class="user-details">
        <summary>사용자 정보 상세</summary>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </details>
    </div>

    <div class="divider"></div>

    <h2>SvelteKit Demo</h2>
    <Counter />
    <div class="mt-8">
      <Button>Hello shadcn-svelte</Button>
    </div>
  {:else}
    <h1>
      <span class="welcome">
        <picture>
          <source srcset={welcome} type="image/webp" />
          <img src={welcomeFallback} alt="Welcome" />
        </picture>
      </span>

      to your new<br />SvelteKit app
    </h1>

    <h2>OAuth2 + JWT 인증이 필요합니다</h2>

    <div class="login-actions">
      <Button on:click={handleLogin} size="lg">Google로 로그인</Button>
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
    padding: 2rem;
  }

  h1 {
    width: 100%;
    text-align: center;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }

  .loading-container {
    text-align: center;
    padding: 2rem;
  }

  .user-info {
    text-align: center;
    margin-bottom: 2rem;
  }

  .email {
    color: #666;
    margin-top: 0.5rem;
  }

  .actions {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .user-details {
    margin-top: 2rem;
    text-align: left;
    max-width: 600px;
  }

  .user-details summary {
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .user-details pre {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.875rem;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: #e0e0e0;
    margin: 2rem 0;
  }

  .login-actions {
    margin-top: 2rem;
  }

  h2 {
    margin-top: 1rem;
    text-align: center;
  }
</style>
