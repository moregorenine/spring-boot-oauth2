<script lang="ts">
  import { onMount } from 'svelte';
  import {
    createReference,
    updateReference,
    getReferences,
    type CreateReferenceDto,
    type UpdateReferenceDto
  } from '$lib/api/references';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { authStore } from '$lib/stores/auth.svelte';
  import type { Reference } from '$lib/../mocks/schemas/reference.schema';

  interface Props {
    editMode?: boolean;
    initialData?: Reference | null;
    onSuccess?: () => void;
    onCancel?: () => void;
  }

  let { editMode = false, initialData = null, onSuccess, onCancel }: Props = $props();

  // 폼 상태
  let process = $state('');
  let phase = $state('');
  let type = $state<'local' | 'official'>('local');
  let avail = $state<'Y' | 'N'>('Y');

  let loading = $state(false);
  let error = $state<string | null>(null);
  let allReferences = $state<Reference[]>([]);

  // Process 옵션 목록 (distinct)
  let processOptions = $derived.by(() => {
    const processes = allReferences.map((ref) => ref.process);
    return [...new Set(processes)].sort();
  });

  // Phase 옵션 목록 (선택된 process에 해당하는 것만 distinct)
  let phaseOptions = $derived.by(() => {
    if (!process) return [];
    const phases = allReferences.filter((ref) => ref.process === process).map((ref) => ref.phase);
    return [...new Set(phases)].sort();
  });

  // 컴포넌트 마운트 시 데이터 로딩
  onMount(async () => {
    try {
      allReferences = await getReferences();

      // 수정 모드일 때 초기 데이터로 폼 필드 설정
      if (editMode && initialData) {
        process = initialData.process;
        phase = initialData.phase;
        type = initialData.type;
        avail = initialData.avail;
      }
    } catch (e) {
      console.error('Failed to load references:', e);
    }
  });

  // 폼 제출
  async function handleSubmit(e: Event) {
    e.preventDefault();

    // 유효성 검사
    if (!process.trim()) {
      error = 'Process는 필수 입력 항목입니다.';
      return;
    }
    if (!phase.trim()) {
      error = 'Phase는 필수 입력 항목입니다.';
      return;
    }

    loading = true;
    error = null;

    try {
      if (editMode && initialData) {
        // 수정 모드
        const updateData: UpdateReferenceDto = {
          process: process.trim(),
          phase: phase.trim(),
          type,
          avail
        };
        await updateReference(initialData.id, updateData);
      } else {
        // 추가 모드
        const createData: CreateReferenceDto = {
          process: process.trim(),
          phase: phase.trim(),
          type,
          avail
          // createUser는 백엔드에서 JWT 토큰으로 자동 주입
        };
        await createReference(createData);
      }

      // 폼 초기화 (추가 모드일 때만)
      if (!editMode) {
        process = '';
        phase = '';
        type = 'local';
        avail = 'Y';
      }

      // 성공 콜백 호출
      onSuccess?.();
    } catch (e) {
      error = editMode ? 'Reference 수정에 실패했습니다.' : 'Reference 추가에 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  // 취소
  function handleCancel() {
    // 폼 초기화
    process = '';
    phase = '';
    type = 'local';
    avail = 'Y';
    error = null;

    onCancel?.();
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}

  <div class="form-row">
    <div class="form-group">
      <label for="process">Process <span class="required">*</span></label>
      <input
        id="process"
        type="text"
        list="process-options"
        bind:value={process}
        placeholder="Process를 선택하거나 입력하세요"
        disabled={loading}
        class="select-input"
      />
      <datalist id="process-options">
        {#each processOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </datalist>
    </div>

    <div class="form-group">
      <label for="type">Type <span class="required">*</span></label>
      <select id="type" bind:value={type} disabled={loading} class="select-input">
        <option value="local">Local</option>
        <option value="official">Official</option>
      </select>
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="avail">Avail <span class="required">*</span></label>
      <select id="avail" bind:value={avail} disabled={loading} class="select-input">
        <option value="Y">Y</option>
        <option value="N">N</option>
      </select>
    </div>
  </div>

  <div class="form-group">
    <label for="phase">Phase <span class="required">*</span></label>
    <input
      id="phase"
      type="text"
      list="phase-options"
      bind:value={phase}
      placeholder="Phase를 선택하거나 입력하세요"
      disabled={loading}
      class="select-input"
    />
    <datalist id="phase-options">
      {#each phaseOptions as option}
        <option value={option}>{option}</option>
      {/each}
    </datalist>
  </div>

  <div class="divider">
    <span>Created By (로그인한 사용자)</span>
  </div>

  <div class="user-info-display">
    {#if authStore.currentUser}
      <div class="user-field">
        <span class="user-label">User ID:</span>
        <span class="user-value">{authStore.currentUser.loginId || '-'}</span>
      </div>
      <div class="user-field">
        <span class="user-label">User Name:</span>
        <span class="user-value">{authStore.currentUser.username || '-'}</span>
      </div>
      <div class="user-field">
        <span class="user-label">Email:</span>
        <span class="user-value">{authStore.currentUser.email || '-'}</span>
      </div>
    {:else}
      <p class="no-user-warning">로그인이 필요합니다.</p>
    {/if}
  </div>

  <div class="form-actions">
    <Button type="button" variant="outline" onclick={handleCancel} disabled={loading}>취소</Button>
    <Button type="submit" disabled={loading}>
      {loading ? (editMode ? '수정 중...' : '추가 중...') : editMode ? '수정' : '추가'}
    </Button>
  </div>
</form>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .required {
    color: hsl(var(--destructive));
  }

  .select-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid hsl(var(--input));
    border-radius: 0.375rem;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }

  .select-input:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 3px hsl(var(--ring) / 0.1);
  }

  .select-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0 1rem;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: hsl(var(--border));
  }

  .divider span {
    padding: 0 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
  }

  .error-message {
    padding: 0.75rem 1rem;
    background-color: hsl(var(--destructive) / 0.1);
    border: 1px solid hsl(var(--destructive) / 0.3);
    border-radius: 0.375rem;
    color: hsl(var(--destructive));
    font-size: 0.875rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid hsl(var(--border));
  }

  .user-info-display {
    padding: 1rem;
    background-color: hsl(var(--muted) / 0.5);
    border-radius: 0.375rem;
    border: 1px solid hsl(var(--border));
  }

  .user-field {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid hsl(var(--border) / 0.5);
  }

  .user-field:last-child {
    border-bottom: none;
  }

  .user-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
  }

  .user-value {
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .no-user-warning {
    text-align: center;
    color: hsl(var(--destructive));
    font-size: 0.875rem;
    margin: 0;
  }
</style>
