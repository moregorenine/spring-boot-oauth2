<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { getReferences, type CreateReferenceDto } from '$lib/api/references';
  import type { Reference } from '$lib/../mocks/db';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus, RefreshCw } from '@lucide/svelte';
  import { Window } from '$lib/components/ui/window';
  import ReferenceForm from '$lib/components/reference-form.svelte';

  let tableDiv: HTMLDivElement;
  let table: Tabulator;
  let references = $state<Reference[]>([]);
  let loading = $state(false);
  let addWindowOpen = $state(false);
  let editWindowOpen = $state(false);
  let selectedReference = $state<Reference | null>(null);

  // Reference 데이터 로딩
  async function loadReferences() {
    loading = true;
    try {
      references = await getReferences();
      if (table) {
        table.setData(references);
      }
    } catch (error) {
      console.error('Failed to load references:', error);
    } finally {
      loading = false;
    }
  }

  // Row 클릭 핸들러
  function handleRowClick(_e: any, row: any) {
    const data = row.getData() as Reference;
    selectedReference = data;
    editWindowOpen = true;
  }

  // Tabulator 테이블 초기화
  onMount(async () => {
    await loadReferences();

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: references,
      rowHeight: 45,
      columns: [
        {
          title: 'ID',
          field: 'id',
          width: 80,
          hozAlign: 'center',
          sorter: 'number'
        },
        {
          title: 'Process',
          field: 'process',
          width: 130,
          formatter: (cell) => {
            const value = cell.getValue();
            const colors: Record<string, string> = {
              design: '#1976d2',
              development: '#7b1fa2',
              testing: '#f57c00',
              deployment: '#388e3c'
            };
            return `<span style="color: ${colors[value] || '#000'}; font-weight: 500;">${value}</span>`;
          }
        },
        {
          title: 'Phase',
          field: 'phase',
          width: 150
        },
        {
          title: 'Type',
          field: 'type',
          width: 100,
          hozAlign: 'center',
          formatter: (cell) => {
            const value = cell.getValue();
            const color = value === 'official' ? '#1565c0' : '#6a1b9a';
            const bg = value === 'official' ? '#e3f2fd' : '#f3e5f5';
            const text = value === 'official' ? 'Official' : 'Local';
            return `<span style="background-color: ${bg}; color: ${color}; padding: 4px 12px; border-radius: 12px; font-weight: 500;">${text}</span>`;
          }
        },
        {
          title: 'Avail',
          field: 'avail',
          width: 80,
          hozAlign: 'center',
          formatter: (cell) => {
            const value = cell.getValue();
            const color = value === 'Y' ? '#2e7d32' : '#c62828';
            const bg = value === 'Y' ? '#e8f5e9' : '#ffebee';
            return `<span style="background-color: ${bg}; color: ${color}; padding: 4px 12px; border-radius: 12px; font-weight: 500;">${value}</span>`;
          }
        },
        {
          title: 'Create User',
          field: 'createUser.name',
          width: 150
        },
        {
          title: 'Email',
          field: 'createUser.email',
          width: 200
        },
        {
          title: 'Create Date',
          field: 'createDate',
          width: 180,
          sorter: 'datetime',
          formatter: (cell) => {
            const value = cell.getValue();
            return new Date(value).toLocaleString('ko-KR');
          }
        }
      ],
      movableColumns: true,
      resizableColumns: true,
      pagination: true,
      paginationSize: 10,
      paginationSizeSelector: [10, 20, 50, 100]
    });

    // rowClick 이벤트를 on 메서드로 바인딩
    table.on('rowClick', handleRowClick);
  });

  // Reference 추가 성공 핸들러
  function handleReferenceAdded() {
    addWindowOpen = false;
    loadReferences();
  }

  // Reference 수정 성공 핸들러
  function handleReferenceUpdated() {
    editWindowOpen = false;
    selectedReference = null;
    loadReferences();
  }
</script>

<svelte:head>
  <title>References Management</title>
  <meta name="description" content="Manage references with Tabulator" />
</svelte:head>

<div class="container mx-auto p-6">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-3xl font-bold mb-2">References Management</h1>
      <p class="text-muted-foreground">
        Tabulator 테이블을 활용한 Reference 데이터 관리 페이지입니다.
      </p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={loadReferences} disabled={loading}>
        <RefreshCw class="h-4 w-4 mr-2 {loading ? 'animate-spin' : ''}" />
        새로고침
      </Button>
      <Button size="sm" onclick={() => (addWindowOpen = true)}>
        <Plus class="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  </div>

  <div bind:this={tableDiv}></div>
</div>

<!-- Non-Modal Window for Adding Reference -->
<Window bind:open={addWindowOpen} title="Add New Reference" width="600px" modal={false}>
  <ReferenceForm onSuccess={handleReferenceAdded} onCancel={() => (addWindowOpen = false)} />
</Window>

<!-- Non-Modal Window for Editing Reference -->
<Window bind:open={editWindowOpen} title="Edit Reference" width="600px" modal={false}>
  <ReferenceForm
    editMode={true}
    initialData={selectedReference}
    onSuccess={handleReferenceUpdated}
    onCancel={() => {
      editWindowOpen = false;
      selectedReference = null;
    }}
  />
</Window>

<style>
  .container {
    max-width: 1400px;
  }

  :global(.tabulator) {
    font-size: 14px;
  }

  :global(.tabulator .tabulator-header) {
    background-color: hsl(var(--muted));
    border-bottom: 2px solid hsl(var(--border));
  }

  :global(.tabulator .tabulator-row:hover) {
    background-color: hsl(var(--muted) / 0.5);
  }
</style>
