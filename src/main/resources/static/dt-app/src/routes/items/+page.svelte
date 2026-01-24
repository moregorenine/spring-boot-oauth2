<script lang="ts">
  import { onMount } from 'svelte';
  import { getItems, createItem, updateItem, deleteItem } from '$lib/api/items';
  import type { Item } from '$lib/../mocks/db';

  let items = $state<Item[]>([]);
  let loading = $state(false);
  let error = $state<string | null>(null);

  // 폼 상태
  let title = $state('');
  let content = $state('');
  let editingId = $state<number | null>(null);

  // 목록 조회
  async function loadItems() {
    loading = true;
    error = null;
    try {
      items = await getItems();
    } catch (e) {
      error = '아이템 목록을 불러오는데 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  // 등록/수정
  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      error = '제목과 내용을 모두 입력해주세요.';
      return;
    }

    loading = true;
    error = null;

    try {
      if (editingId !== null) {
        // 수정
        await updateItem(editingId, { title, content });
      } else {
        // 등록
        await createItem({ title, content });
      }

      // 폼 초기화
      title = '';
      content = '';
      editingId = null;

      // 목록 새로고침
      await loadItems();
    } catch (e) {
      error = editingId !== null ? '수정에 실패했습니다.' : '등록에 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  // 수정 모드로 전환
  function handleEdit(item: Item) {
    editingId = item.id;
    title = item.title;
    content = item.content;
  }

  // 수정 취소
  function handleCancelEdit() {
    editingId = null;
    title = '';
    content = '';
  }

  // 삭제
  async function handleDelete(id: number) {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    loading = true;
    error = null;

    try {
      await deleteItem(id);
      await loadItems();
    } catch (e) {
      error = '삭제에 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadItems();
  });
</script>

<div class="container">
  <h1>Items CRUD Sample</h1>
  <p class="description">
    MSW + Dexie를 활용한 REST API 시뮬레이션 샘플 페이지입니다.
    <br />
    브라우저를 재시작해도 데이터가 유지됩니다.
  </p>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <!-- 등록/수정 폼 -->
  <form onsubmit={handleSubmit} class="form">
    <h2>{editingId !== null ? '아이템 수정' : '아이템 등록'}</h2>

    <div class="form-group">
      <label for="title">제목</label>
      <input
        id="title"
        type="text"
        bind:value={title}
        placeholder="제목을 입력하세요"
        disabled={loading}
      />
    </div>

    <div class="form-group">
      <label for="content">내용</label>
      <textarea
        id="content"
        bind:value={content}
        placeholder="내용을 입력하세요"
        rows="4"
        disabled={loading}
      ></textarea>
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

  <!-- 아이템 목록 -->
  <div class="items-section">
    <h2>아이템 목록 ({items.length})</h2>

    {#if loading && items.length === 0}
      <div class="loading">로딩 중...</div>
    {:else if items.length === 0}
      <div class="empty">등록된 아이템이 없습니다.</div>
    {:else}
      <div class="items-list">
        {#each items as item (item.id)}
          <div class="item-card">
            <div class="item-header">
              <h3>{item.title}</h3>
              <span class="item-date">
                {new Date(item.createdAt).toLocaleString('ko-KR')}
              </span>
            </div>
            <p class="item-content">{item.content}</p>
            <div class="item-actions">
              <button onclick={() => handleEdit(item)} disabled={loading}> 수정 </button>
              <button class="delete" onclick={() => handleDelete(item.id)} disabled={loading}>
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
    max-width: 800px;
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
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  .form-group input:disabled,
  .form-group textarea:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
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

  .items-section h2 {
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

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .item-card {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: box-shadow 0.2s;
  }

  .item-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .item-header h3 {
    font-size: 1.25rem;
    margin: 0;
    color: #333;
  }

  .item-date {
    font-size: 0.875rem;
    color: #999;
    white-space: nowrap;
  }

  .item-content {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
    white-space: pre-wrap;
  }

  .item-actions {
    display: flex;
    gap: 0.5rem;
  }

  .item-actions button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
</style>
