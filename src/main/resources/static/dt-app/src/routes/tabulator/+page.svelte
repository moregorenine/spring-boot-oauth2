<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { sampleData } from './sampledata';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Download } from '@lucide/svelte';
  // 폐쇄망 환경을 위한 npm 패키지 import
  import * as XLSX from 'xlsx';
  import jsPDF from 'jspdf';
  // jspdf-autotable를 동적으로 로드
  let autoTableLoaded = false;

  let tableDiv: HTMLDivElement;
  let table: Tabulator;

  onMount(async () => {
    // 전역 객체에 라이브러리 등록 (Tabulator가 사용할 수 있도록)
    if (typeof window !== 'undefined') {
      (window as any).XLSX = XLSX;
      (window as any).jsPDF = jsPDF;
      (window as any).jspdf = jsPDF; // Tabulator는 소문자 jspdf를 찾음

      // autoTable 동적 로드
      try {
        await import('jspdf-autotable');
        autoTableLoaded = true;
      } catch (e) {
        console.error('Failed to load jspdf-autotable:', e);
      }
    }

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: sampleData,
      rowHeight: 40, // 행 높이 고정
      // autoColumns: true,
      columns: [
        //define the table columns
        { title: 'Name', field: 'name', editor: 'input' },
        {
          title: 'Task Progress',
          field: 'progress',
          hozAlign: 'left',
          formatter: 'progress',
          editor: true
        },
        {
          title: 'Gender',
          field: 'gender',
          width: 95,
          editor: 'list',
          editorParams: { values: ['male', 'female'] }
        },
        {
          title: 'Rating',
          field: 'rating',
          formatter: 'star',
          hozAlign: 'center',
          width: 100,
          editor: true
        },
        { title: 'Color', field: 'col', width: 130, editor: 'input' },
        { title: 'Date Of Birth', field: 'dob', width: 130, sorter: 'date', hozAlign: 'center' },
        {
          title: 'Driver',
          field: 'car',
          width: 90,
          hozAlign: 'center',
          formatter: 'tickCross',
          sorter: 'boolean',
          editor: true
        }
      ],
      movableColumns: true,
      resizableRows: true
    });
  });

  function downloadCSV() {
    table.download('csv', 'data.csv');
  }

  function downloadJSON() {
    table.download('json', 'data.json');
  }

  function downloadXLSX() {
    table.download('xlsx', 'data.xlsx', { sheetName: 'My Data' });
  }

  function downloadPDF() {
    table.download('pdf', 'data.pdf', {
      orientation: 'landscape',
      title: 'Tabulator Data Export'
    });
  }

  function downloadHTML() {
    table.download('html', 'data.html', { style: true });
  }
</script>

<svelte:head>
  <title>Tabulator Sample</title>
  <meta name="description" content="Tabulator table library sample" />
</svelte:head>

<div class="container mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Tabulator Sample</h1>
  <p class="mb-4 text-muted-foreground">
    Interactive table with sorting, pagination, and column resizing.
  </p>

  <!-- 다운로드 버튼 -->
  <div class="flex flex-wrap gap-2 mb-4">
    <Button variant="outline" size="sm" onclick={downloadCSV}>
      <Download class="h-4 w-4 mr-2" />
      CSV
    </Button>
    <Button variant="outline" size="sm" onclick={downloadJSON}>
      <Download class="h-4 w-4 mr-2" />
      JSON
    </Button>
    <Button variant="outline" size="sm" onclick={downloadXLSX}>
      <Download class="h-4 w-4 mr-2" />
      Excel
    </Button>
    <Button variant="outline" size="sm" onclick={downloadPDF}>
      <Download class="h-4 w-4 mr-2" />
      PDF
    </Button>
    <Button variant="outline" size="sm" onclick={downloadHTML}>
      <Download class="h-4 w-4 mr-2" />
      HTML
    </Button>
  </div>

  <div bind:this={tableDiv}></div>
</div>
