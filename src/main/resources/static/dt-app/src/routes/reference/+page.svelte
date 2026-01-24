<script lang="ts">
  import { onMount } from 'svelte';
  import {
    getReferences,
    createReference,
    updateReference,
    deleteReference
  } from '$lib/api/references';
  import type { Reference } from '$lib/../mocks/db';

  let references = $state<Reference[]>([]);
  let loading = $state(false);
  let error = $state<string | null>(null);

  // 폼 상태
  let process = $state<'design' | 'development' | 'testing' | 'deployment'>('design');
  let phase = $state('');
  let avail = $state<'Y' | 'N'>('Y');
  let userId = $state('');
  let userName = $state('');
  let userEmail = $state('');
  let editingId = $state<number | null>(null);

  // 목록 조회
  async function loadReferences() {
    loading = true;
    error = null;
    try {
      references = await getReferences();
    } catch (e) {
      error = 'Reference 목록을 불러오는데 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  // 등록/수정
  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!userId.trim() || !userName.trim() || !userEmail.trim() || !phase.trim()) {
      error = '모든 필수 정보를 입력해주세요.';
      return;
    }

    loading = true;
    error = null;

    try {
      const data = {
        process,
        phase,
        avail,
        createUser: {
          id: userId,
          name: userName,
          email: userEmail
        }
      };

      if (editingId !== null) {
        // 수정
        await updateReference(editingId, data);
      } else {
        // 등록
        await createReference(data);
      }

      // 폼 초기화
      process = 'design';
      phase = '';
      avail = 'Y';
      userId = '';
      userName = '';
      userEmail = '';
      editingId = null;

      // 목록 새로고침
      await loadReferences();
    } catch (e) {
      error = editingId !== null ? '수정에 실패했습니다.' : '등록에 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  // 수정 모드로 전환
  function handleEdit(reference: Reference) {
    editingId = reference.id;
    process = reference.process;
    phase = reference.phase;
    avail = reference.avail;
    userId = reference.createUser.id;
    userName = reference.createUser.name;
    userEmail = reference.createUser.email;
  }

  // 수정 취소
  function handleCancelEdit() {
    editingId = null;
    process = 'design';
    phase = '';
    avail = 'Y';
    userId = '';
    userName = '';
    userEmail = '';
  }

  // 삭제
  async function handleDelete(id: number) {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    loading = true;
    error = null;

    try {
      await deleteReference(id);
      await loadReferences();
    } catch (e) {
      error = '삭제에 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadReferences();
  });
</script>

<div class="container">
  <h1>Reference CRUD Sample</h1>
  <p class="description">
    MSW + Dexie를 활용한 Reference 객체 관리 샘플 페이지입니다.
    <br />
    Process와 Avail은 Union 타입으로, Phase는 문자열, CreateUser는 객체 형태로 관리됩니다.
  </p>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <!-- 등록/수정 폼 -->
  <form onsubmit={handleSubmit} class="form">
    <h2>{editingId !== null ? 'Reference 수정' : 'Reference 등록'}</h2>

    <div class="form-row">
      <div class="form-group">
        <label for="process">Process</label>
        <select id="process" bind:value={process} disabled={loading}>
          <option value="design">Design</option>
          <option value="development">Development</option>
          <option value="testing">Testing</option>
          <option value="deployment">Deployment</option>
        </select>
      </div>

      <div class="form-group">
        <label for="phase">Phase</label>
        <input
          id="phase"
          type="text"
          bind:value={phase}
          placeholder="Phase를 입력하세요"
          disabled={loading}
        />
      </div>

      <div class="form-group">
        <label for="avail">Avail</label>
        <select id="avail" bind:value={avail} disabled={loading}>
          <option value="Y">Y</option>
          <option value="N">N</option>
        </select>
      </div>
    </div>

    <h3>Create User</h3>

    <div class="form-group">
      <label for="userId">User ID</label>
      <input
        id="userId"
        type="text"
        bind:value={userId}
        placeholder="사용자 ID를 입력하세요"
        disabled={loading}
      />
    </div>

    <div class="form-group">
      <label for="userName">User Name</label>
      <input
        id="userName"
        type="text"
        bind:value={userName}
        placeholder="사용자 이름을 입력하세요"
        disabled={loading}
      />
    </div>

    <div class="form-group">
      <label for="userEmail">User Email</label>
      <input
        id="userEmail"
        type="email"
        bind:value={userEmail}
        placeholder="사용자 이메일을 입력하세요"
        disabled={loading}
      />
    </div>

    <div class="form-actions">
      <button type="submit" disabled={loading}>
        {editingId !== null ? '수정' : '등록'}
      </button>
      {#if editingId !== null}
        <button type="button" onclick={handleCancelEdit} disabled={loading}> 취소 </button>
      {/if}
    </div>
  </form>

  <!-- Reference 목록 -->
  <div class="references-section">
    <h2>Reference 목록 ({references.length})</h2>

    {#if loading && references.length === 0}
      <div class="loading">로딩 중...</div>
    {:else if references.length === 0}
      <div class="empty">등록된 Reference가 없습니다.</div>
    {:else}
      <div class="references-list">
        {#each references as reference (reference.id)}
          <div class="reference-card">
            <div class="reference-header">
              <div class="reference-badges">
                <span class="badge process-{reference.process}">{reference.process}</span>
                <span class="badge phase">Phase: {reference.phase}</span>
                <span class="badge avail-{reference.avail}">Avail: {reference.avail}</span>
              </div>
              <span class="reference-date">
                {new Date(reference.createDate).toLocaleString('ko-KR')}
              </span>
            </div>

            <div class="user-info">
              <h4>Created By</h4>
              <div class="user-details">
                <p><strong>ID:</strong> {reference.createUser.id}</p>
                <p><strong>Name:</strong> {reference.createUser.name}</p>
                <p><strong>Email:</strong> {reference.createUser.email}</p>
              </div>
            </div>

            <div class="reference-actions">
              <button onclick={() => handleEdit(reference)} disabled={loading}> 수정 </button>
              <button class="delete" onclick={() => handleDelete(reference.id)} disabled={loading}>
                삭제
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .description {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .error {
    background-color: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #fcc;
  }

  .form {
    background-color: #f9f9f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid #e0e0e0;
  }

  .form h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .form h3 {
    font-size: 1.1rem;
    margin: 1.5rem 0 1rem;
    color: #555;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  .form-group input:disabled,
  .form-group select:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #4a90e2;
    color: white;
  }

  button:hover:not(:disabled) {
    background-color: #357abd;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button.delete {
    background-color: #e74c3c;
  }

  button.delete:hover:not(:disabled) {
    background-color: #c0392b;
  }

  .references-section h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .loading,
  .empty {
    text-align: center;
    padding: 2rem;
    color: #999;
    font-size: 1.1rem;
  }

  .references-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .reference-card {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: box-shadow 0.2s;
  }

  .reference-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .reference-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .reference-badges {
    display: flex;
    gap: 0.5rem;
  }

  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .badge.process-design {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  .badge.process-development {
    background-color: #f3e5f5;
    color: #7b1fa2;
  }

  .badge.process-testing {
    background-color: #fff3e0;
    color: #f57c00;
  }

  .badge.process-deployment {
    background-color: #e8f5e9;
    color: #388e3c;
  }

  .badge.phase {
    background-color: #fff3e0;
    color: #e65100;
  }

  .badge.avail-Y {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  .badge.avail-N {
    background-color: #ffebee;
    color: #c62828;
  }

  .reference-date {
    font-size: 0.875rem;
    color: #999;
    white-space: nowrap;
  }

  .user-info {
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .user-info h4 {
    font-size: 0.875rem;
    color: #666;
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .user-details p {
    margin: 0.25rem 0;
    color: #555;
    font-size: 0.95rem;
  }

  .user-details strong {
    color: #333;
    margin-right: 0.5rem;
  }

  .reference-actions {
    display: flex;
    gap: 0.5rem;
  }

  .reference-actions button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
</style>
