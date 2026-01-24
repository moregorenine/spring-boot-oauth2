<script lang="ts">
  import { onMount } from 'svelte';
  import Quill from 'quill';
  import 'quill/dist/quill.snow.css';

  let editorElement: HTMLDivElement;
  let toolbarElement: HTMLDivElement;
  let readOnlyElement: HTMLDivElement;
  let customToolbarElement: HTMLDivElement;
  let customEditorElement: HTMLDivElement;

  let quillBasic: Quill;
  let quillReadOnly: Quill;
  let quillCustom: Quill;

  let editorContent = $state('');

  onMount(() => {
    // 기본 에디터
    quillBasic = new Quill(editorElement, {
      theme: 'snow',
      placeholder: '내용을 입력하세요...',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    // 내용 변경 감지
    quillBasic.on('text-change', () => {
      editorContent = quillBasic.root.innerHTML;
    });

    // 읽기 전용 에디터
    quillReadOnly = new Quill(readOnlyElement, {
      theme: 'snow',
      readOnly: true,
      modules: {
        toolbar: false
      }
    });

    // 샘플 내용 설정
    quillReadOnly.setContents([
      { insert: 'Quill 읽기 전용 모드\n', attributes: { header: 1 } },
      { insert: '이 에디터는 ' },
      { insert: '읽기 전용', attributes: { bold: true } },
      { insert: ' 모드로 설정되어 있습니다.\n편집할 수 없지만 내용을 복사할 수 있습니다.\n\n' },
      { insert: '주요 특징:\n', attributes: { bold: true } },
      { insert: '텍스트 선택 가능\n', attributes: { list: 'bullet' } },
      { insert: '복사 가능\n', attributes: { list: 'bullet' } },
      { insert: '편집 불가능\n', attributes: { list: 'bullet' } }
    ]);

    // 커스텀 툴바 에디터
    quillCustom = new Quill(customEditorElement, {
      theme: 'snow',
      placeholder: '커스텀 툴바로 작성해보세요...',
      modules: {
        toolbar: {
          container: customToolbarElement
        }
      }
    });

    return () => {
      // Cleanup
      if (quillBasic) quillBasic = null as any;
      if (quillReadOnly) quillReadOnly = null as any;
      if (quillCustom) quillCustom = null as any;
    };
  });

  function getContent() {
    if (quillBasic) {
      const delta = quillBasic.getContents();
      const html = quillBasic.root.innerHTML;
      const text = quillBasic.getText();

      alert(`
텍스트: ${text}

HTML 길이: ${html.length} characters
Delta 길이: ${JSON.stringify(delta).length} characters
      `);
    }
  }

  function setContent() {
    if (quillBasic) {
      quillBasic.setContents([
        { insert: 'Quill.js 샘플 내용\n', attributes: { header: 1 } },
        { insert: '\n이것은 ' },
        { insert: '프로그래밍 방식', attributes: { bold: true, color: '#e60000' } },
        { insert: '으로 설정된 내용입니다.\n\n' },
        { insert: '다양한 포맷팅이 가능합니다:\n', attributes: { italic: true } },
        { insert: '볼드 텍스트\n', attributes: { list: 'bullet', bold: true } },
        { insert: '이탤릭 텍스트\n', attributes: { list: 'bullet', italic: true } },
        { insert: '언더라인 텍스트\n', attributes: { list: 'bullet', underline: true } },
        { insert: '색상 텍스트\n', attributes: { list: 'bullet', color: '#0066cc' } }
      ]);
    }
  }

  function clearContent() {
    if (quillBasic) {
      quillBasic.setText('');
    }
  }
</script>

<svelte:head>
  <title>Quill Demo - Rich Text Editor</title>
</svelte:head>

<div class="container mx-auto py-8 px-4">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-2">Quill.js Rich Text Editor</h1>
    <p class="text-muted-foreground">강력하고 확장 가능한 리치 텍스트 에디터 라이브러리입니다.</p>
  </div>

  <div class="grid gap-8">
    <!-- 기본 에디터 -->
    <div class="space-y-4">
      <div>
        <h2 class="text-2xl font-semibold mb-2">기본 에디터</h2>
        <p class="text-sm text-muted-foreground mb-4">
          모든 기본 포맷팅 옵션을 포함한 표준 Quill 에디터입니다.
        </p>
      </div>

      <div class="border rounded-lg overflow-hidden bg-white">
        <div bind:this={editorElement} class="min-h-[300px]"></div>
      </div>

      <div class="flex gap-2">
        <button
          onclick={getContent}
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          내용 가져오기
        </button>
        <button
          onclick={setContent}
          class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
        >
          샘플 내용 설정
        </button>
        <button
          onclick={clearContent}
          class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
        >
          내용 지우기
        </button>
      </div>

      {#if editorContent}
        <div class="p-4 bg-muted rounded-lg">
          <p class="text-sm font-semibold mb-2">실시간 HTML 출력:</p>
          <pre class="text-xs overflow-x-auto">{editorContent}</pre>
        </div>
      {/if}
    </div>

    <!-- 읽기 전용 에디터 -->
    <div class="space-y-4">
      <div>
        <h2 class="text-2xl font-semibold mb-2">읽기 전용 에디터</h2>
        <p class="text-sm text-muted-foreground mb-4">
          편집할 수 없지만 내용을 보고 복사할 수 있는 에디터입니다.
        </p>
      </div>

      <div class="border rounded-lg overflow-hidden bg-white">
        <div bind:this={readOnlyElement} class="min-h-[200px]"></div>
      </div>
    </div>

    <!-- 커스텀 툴바 에디터 -->
    <div class="space-y-4">
      <div>
        <h2 class="text-2xl font-semibold mb-2">커스텀 툴바 에디터</h2>
        <p class="text-sm text-muted-foreground mb-4">
          사용자 정의 툴바 레이아웃을 가진 에디터입니다.
        </p>
      </div>

      <div class="border rounded-lg overflow-hidden bg-white">
        <!-- 커스텀 툴바 -->
        <div bind:this={customToolbarElement} class="border-b bg-gray-50 p-2">
          <span class="ql-formats">
            <select class="ql-header">
              <option value="1">제목 1</option>
              <option value="2">제목 2</option>
              <option value="3">제목 3</option>
              <option selected>일반</option>
            </select>
          </span>
          <span class="ql-formats">
            <button class="ql-bold" title="굵게"></button>
            <button class="ql-italic" title="기울임"></button>
            <button class="ql-underline" title="밑줄"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-list" value="ordered" title="번호 목록"></button>
            <button class="ql-list" value="bullet" title="글머리 기호"></button>
          </span>
          <span class="ql-formats">
            <select class="ql-color" title="텍스트 색상"></select>
            <select class="ql-background" title="배경 색상"></select>
          </span>
          <span class="ql-formats">
            <button class="ql-link" title="링크"></button>
            <button class="ql-image" title="이미지"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-clean" title="포맷 제거"></button>
          </span>
        </div>

        <div bind:this={customEditorElement} class="min-h-[250px]"></div>
      </div>
    </div>

    <!-- 기능 설명 -->
    <div class="mt-8 space-y-6">
      <h2 class="text-3xl font-bold">주요 기능</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="p-4 border rounded-lg">
          <h3 class="font-semibold mb-2">📝 리치 텍스트 편집</h3>
          <p class="text-sm text-muted-foreground">
            볼드, 이탤릭, 언더라인, 색상 등 다양한 텍스트 포맷팅을 지원합니다.
          </p>
        </div>
        <div class="p-4 border rounded-lg">
          <h3 class="font-semibold mb-2">🎨 커스터마이징</h3>
          <p class="text-sm text-muted-foreground">
            툴바와 테마를 자유롭게 커스터마이징할 수 있습니다.
          </p>
        </div>
        <div class="p-4 border rounded-lg">
          <h3 class="font-semibold mb-2">📋 Delta 포맷</h3>
          <p class="text-sm text-muted-foreground">
            JSON 기반의 Delta 포맷으로 내용을 저장하고 불러올 수 있습니다.
          </p>
        </div>
        <div class="p-4 border rounded-lg">
          <h3 class="font-semibold mb-2">🔌 확장성</h3>
          <p class="text-sm text-muted-foreground">
            모듈과 플러그인을 통해 기능을 확장할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  :global(.ql-editor) {
    min-height: 200px;
    font-size: 16px;
  }

  :global(.ql-toolbar) {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  :global(.ql-container) {
    font-family: inherit;
  }
</style>
