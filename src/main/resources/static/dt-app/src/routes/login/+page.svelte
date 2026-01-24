<script lang="ts">
  import { login } from '$lib/api/auth';
  import { authStore } from '$lib/stores/auth.svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';

  let loginId = $state('');
  let password = $state('');
  let error = $state<string | null>(null);
  let loading = $state(false);

  async function handleLogin(e: Event) {
    e.preventDefault();

    if (!loginId.trim() || !password.trim()) {
      error = '아이디와 비밀번호를 입력해주세요.';
      return;
    }

    loading = true;
    error = null;

    try {
      const response = await login({ loginId, password });
      authStore.setAuth(response.user, response.token);
      goto('/');
    } catch (e) {
      error = '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      console.error(e);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>로그인</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <h1>로그인</h1>
      <p>JWT 인증을 통해 로그인하세요</p>
    </div>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <form onsubmit={handleLogin} class="login-form">
      <div class="form-group">
        <label for="loginId">Login ID</label>
        <Input
          id="loginId"
          type="text"
          bind:value={loginId}
          placeholder="아이디를 입력하세요"
          disabled={loading}
          autocomplete="username"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <Input
          id="password"
          type="password"
          bind:value={password}
          placeholder="비밀번호를 입력하세요"
          disabled={loading}
          autocomplete="current-password"
        />
      </div>

      <Button type="submit" class="w-full" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </Button>
    </form>

    <div class="demo-credentials">
      <p class="demo-title">테스트 계정:</p>
      <p class="demo-info">ID: <strong>testuser</strong> / PW: <strong>password123</strong></p>
      <p class="demo-info">ID: <strong>admin</strong> / PW: <strong>admin123</strong></p>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      hsl(var(--primary) / 0.1) 0%,
      hsl(var(--secondary) / 0.1) 100%
    );
    padding: 2rem;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    background-color: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-header h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
  }

  .login-header p {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .error-message {
    padding: 0.75rem 1rem;
    background-color: hsl(var(--destructive) / 0.1);
    border: 1px solid hsl(var(--destructive) / 0.3);
    border-radius: 0.375rem;
    color: hsl(var(--destructive));
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .demo-credentials {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid hsl(var(--border));
  }

  .demo-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
  }

  .demo-info {
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground));
    margin: 0.25rem 0;
  }

  .demo-info strong {
    color: hsl(var(--foreground));
    font-family: 'Courier New', monospace;
  }
</style>
