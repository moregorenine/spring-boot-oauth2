<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { WindowProps } from './types';
  import WindowTitlebar from './WindowTitlebar.svelte';
  import { windowStack } from './windowStack';
  import './window.scss';

  let {
    open = $bindable(false),
    title = '',
    variant = 'default',
    modal = true, // true: 모달 (블러 + 오버레이), false: non-modal (투명 오버레이)
    closeOnOverlay = true,
    closeOnEscape = true,
    width = '600px',
    height = 'auto',
    maxWidth = '90vw',
    maxHeight = '90vh',
    onClose,
    children
  }: WindowProps & { children?: any } = $props();

  let overlayElement: HTMLDivElement | null = $state(null);
  let windowElement: HTMLDivElement | null = $state(null);
  let isAnimating = $state(false);
  let isVisible = $state(false);
  let isMaximized = $state(false);

  // 최대화 전 상태 저장
  let preMaximizePosition = $state({ x: 0, y: 0 });
  let preMaximizeSize = $state({ width: 600, height: 400 });

  // 윈도우 고유 ID 생성
  const windowId = `window-${Math.random().toString(36).substr(2, 9)}`;

  // Drag state
  let isDragging = $state(false);
  let dragOffset = $state({ x: 0, y: 0 });
  let windowPosition = $state({ x: 0, y: 0 });

  // Resize state
  let isResizing = $state(false);
  let resizeDirection = $state<string>('');
  let resizeStartPos = $state({ x: 0, y: 0 });
  let resizeStartSize = $state({ width: 0, height: 0 });
  let resizeStartWindowPos = $state({ x: 0, y: 0 }); // 리사이즈 시작 시 윈도우 위치
  let resizeStartRect = $state({ top: 0, left: 0 }); // 리사이즈 시작 시 윈도우의 뷰포트 기준 위치
  let windowSize = $state({ width: 600, height: 400 }); // 초기 크기
  const minWidth = 300;
  const minHeight = 200;

  // 애니메이션 상태
  let overlayClass = $derived.by(() => {
    const animationClass = open
      ? isAnimating
        ? 'window-overlay-enter'
        : ''
      : isAnimating
        ? 'window-overlay-exit'
        : '';
    const modalClass = !modal ? 'non-modal' : '';
    return `${animationClass} ${modalClass}`.trim();
  });

  let windowClass = $derived(
    open ? (isAnimating ? 'window-enter' : '') : isAnimating ? 'window-exit' : ''
  );

  // ESC 키 핸들러
  function handleKeydown(event: KeyboardEvent) {
    if (closeOnEscape && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation(); // 부모 윈도우로 이벤트 전파 방지
      handleClose();
    }
  }

  // Overlay 클릭 핸들러
  function handleOverlayClick(event: MouseEvent) {
    if (closeOnOverlay && event.target === overlayElement) {
      handleClose();
    }
  }

  // 닫기 핸들러
  function handleClose() {
    open = false;
    onClose?.();
  }

  // 최대화 핸들러
  function handleMaximize() {
    if (!isMaximized) {
      // 최대화: 현재 위치와 크기 저장
      preMaximizePosition = { x: windowPosition.x, y: windowPosition.y };
      preMaximizeSize = { width: windowSize.width, height: windowSize.height };
      windowPosition = { x: 0, y: 0 };
    } else {
      // 최대화 해제: 이전 위치와 크기 복원
      windowPosition = { x: preMaximizePosition.x, y: preMaximizePosition.y };
      windowSize = { width: preMaximizeSize.width, height: preMaximizeSize.height };
    }
    isMaximized = !isMaximized;
  }

  // Drag handlers
  function handleDragStart(e: MouseEvent) {
    if (isMaximized) return; // Disable dragging when maximized

    isDragging = true;
    dragOffset = {
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y
    };
  }

  function handleDragMove(e: MouseEvent) {
    if (!isDragging || !windowElement) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // 윈도우의 현재 위치를 계산 (뷰포트 기준)
    const rect = windowElement.getBoundingClientRect();
    const currentTop = rect.top;

    // 새로운 Y 위치로 이동했을 때의 top 값 계산
    const potentialTop = currentTop + (newY - windowPosition.y);

    // 뷰포트 상단(0)을 넘지 않도록 제한
    const minY = potentialTop < 0 ? windowPosition.y - currentTop : newY;

    windowPosition = {
      x: newX,
      y: minY
    };
  }

  function handleDragEnd() {
    isDragging = false;
  }

  // Resize handlers
  function handleResizeStart(e: MouseEvent, direction: string) {
    if (isMaximized) return; // Disable resizing when maximized

    e.preventDefault();
    e.stopPropagation();

    if (!windowElement) return;

    const rect = windowElement.getBoundingClientRect();

    isResizing = true;
    resizeDirection = direction;
    resizeStartPos = { x: e.clientX, y: e.clientY };
    resizeStartSize = { width: windowSize.width, height: windowSize.height };
    resizeStartWindowPos = { x: windowPosition.x, y: windowPosition.y };
    resizeStartRect = { top: rect.top, left: rect.left };
  }

  function handleResizeMove(e: MouseEvent) {
    if (!isResizing || !windowElement) return;

    const deltaX = e.clientX - resizeStartPos.x;
    const deltaY = e.clientY - resizeStartPos.y;

    let newWidth = resizeStartSize.width;
    let newHeight = resizeStartSize.height;
    let newX = resizeStartWindowPos.x; // 시작 위치 기준 (좌측/상단 리사이즈 시에만 변경)
    let newY = resizeStartWindowPos.y; // 시작 위치 기준 (좌측/상단 리사이즈 시에만 변경)

    // 방향에 따라 크기 및 위치 조정
    if (resizeDirection.includes('e')) {
      // 우측: 너비만 증가 (위치 변경 없음)
      newWidth = Math.max(minWidth, resizeStartSize.width + deltaX);
    }

    if (resizeDirection.includes('w')) {
      // 좌측: 너비 증가 + 좌측으로 위치 이동
      const widthChange = -deltaX; // 좌측으로 드래그하면 deltaX는 음수, 너비는 증가
      newWidth = Math.max(minWidth, resizeStartSize.width + widthChange);
      // 실제 적용된 너비 변화량 계산
      const actualWidthChange = newWidth - resizeStartSize.width;
      // 너비가 증가한 만큼 좌측으로 이동
      newX = resizeStartWindowPos.x - actualWidthChange;
    }

    if (resizeDirection.includes('s')) {
      // 하단: 높이만 증가 (위치 변경 없음)
      newHeight = Math.max(minHeight, resizeStartSize.height + deltaY);
    }

    if (resizeDirection.includes('n')) {
      // 상단: 높이 증가 + 상단으로 위치 이동
      const heightChange = -deltaY; // 상단으로 드래그하면 deltaY는 음수, 높이는 증가
      newHeight = Math.max(minHeight, resizeStartSize.height + heightChange);
      // 실제 적용된 높이 변화량 계산
      const actualHeightChange = newHeight - resizeStartSize.height;
      // 높이가 증가한 만큼 상단으로 이동
      const potentialY = resizeStartWindowPos.y - actualHeightChange;

      // 상단 경계 체크: 윈도우가 뷰포트 상단을 넘지 않도록
      // 시작 위치의 top + 이동량으로 계산
      const potentialTop = resizeStartRect.top - actualHeightChange;
      if (potentialTop >= 0) {
        // 경계 내부: 정상적으로 리사이즈
        newY = potentialY;
      } else {
        // 상단 경계에 도달: top이 0이 되도록 조정
        // newY = 0이 되려면: resizeStartRect.top + (newY - resizeStartWindowPos.y) = 0
        // newY = resizeStartWindowPos.y - resizeStartRect.top
        newY = resizeStartWindowPos.y - resizeStartRect.top;
        // 높이는 시작 높이 + 시작 top만큼 증가
        newHeight = resizeStartSize.height + resizeStartRect.top;
      }
    }

    windowSize = { width: newWidth, height: newHeight };
    windowPosition = { x: newX, y: newY };
  }

  function handleResizeEnd() {
    isResizing = false;
    resizeDirection = '';
  }

  // Focus trap
  function trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTabKey);
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }

  // open 상태 변경 감지
  $effect(() => {
    if (open) {
      // 위치 초기화 (중앙 위치 계산) - 초기 크기 사용
      if (typeof window !== 'undefined') {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // 초기 크기(600x400)를 사용하여 중앙 계산
        const centerX = (viewportWidth - 600) / 2;
        const centerY = (viewportHeight - 400) / 2;
        windowPosition = { x: centerX, y: centerY };
      } else {
        windowPosition = { x: 0, y: 0 };
      }

      // fullscreen variant는 자동으로 최대화
      if (variant === 'fullscreen') {
        isMaximized = true;
      }

      isVisible = true;
      isAnimating = true;

      // 애니메이션 완료 후
      const timer = setTimeout(() => {
        isAnimating = false;

        // 윈도우 스택에 등록 (modal=true일 때만 스크롤 잠금)
        windowStack.register(windowId, overlayElement, modal);

        if (windowElement) {
          const cleanup = trapFocus(windowElement);
          return cleanup;
        }
      }, 200);

      return () => clearTimeout(timer);
    } else if (isVisible) {
      // 윈도우 스택에서 제거 (modal=true일 때만 스크롤 해제)
      windowStack.unregister(windowId, modal);

      // 닫기 애니메이션 시작
      isAnimating = true;

      // 애니메이션 완료 후 DOM에서 제거
      const timer = setTimeout(() => {
        isVisible = false;
        isAnimating = false;
        // 최대화 상태 리셋 (다음에 열 때 올바르게 동작하도록)
        isMaximized = false;
        // 위치 초기화는 다음에 열 때 수행 (닫기 애니메이션이 드래그한 위치에서 실행되도록)
      }, 200);

      return () => clearTimeout(timer);
    }
  });

  // 키보드 이벤트 리스너
  onMount(() => {
    if (typeof window !== 'undefined') {
      // keydown은 overlay 요소에서 처리 (중첩 윈도우 지원)
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      // keydown은 overlay 요소에서 처리 (중첩 윈도우 지원)
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    }
  });

  // z-index 관리
  let windowZIndex = $state(50);

  $effect(() => {
    // windowStack 구독하여 z-index 변경 감지
    const unsubscribe = windowStack.subscribe((stack) => {
      const window = stack.find((w) => w.id === windowId);
      if (window) {
        windowZIndex = window.zIndex;
      }
    });

    return () => {
      unsubscribe();
    };
  });

  // 윈도우 클릭 시 최상위로 이동
  function handleWindowMouseDown() {
    if (!modal && open) {
      windowStack.bringToFront(windowId);
    }
  }

  // 스타일 계산
  let windowStyle = $derived(() => {
    if (isMaximized || variant === 'fullscreen') {
      return 'width: 100%; height: 100%; top: 0; left: 0;';
    }

    // windowPosition은 이미 절대 위치(top/left)
    return `width: ${windowSize.width}px; height: ${windowSize.height}px; max-width: ${maxWidth}; max-height: ${maxHeight}; top: ${windowPosition.y}px; left: ${windowPosition.x}px;`;
  });
</script>

{#if isVisible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={overlayElement}
    class="window-overlay {overlayClass}"
    style="z-index: {windowZIndex};"
    onclick={handleOverlayClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'window-title' : undefined}
    tabindex="-1"
  >
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={windowElement}
      class="window-container {windowClass} variant-{variant}"
      class:variant-fullscreen={isMaximized}
      style={windowStyle()}
      onmousedown={handleWindowMouseDown}
    >
      <WindowTitlebar
        {title}
        {isMaximized}
        onClose={handleClose}
        onMaximize={handleMaximize}
        onDragStart={handleDragStart}
      />
      <div class="window-content">
        {@render children?.()}
      </div>

      {#if !isMaximized}
        <!-- Resize handles -->
        <div
          class="resize-handle resize-n"
          role="presentation"
          aria-hidden="true"
          onmousedown={(e) => handleResizeStart(e, 'n')}
        ></div>
        <div
          class="resize-handle resize-s"
          role="presentation"
          aria-hidden="true"
          onmousedown={(e) => handleResizeStart(e, 's')}
        ></div>
        <div
          class="resize-handle resize-e"
          role="presentation"
          aria-hidden="true"
          onmousedown={(e) => handleResizeStart(e, 'e')}
        ></div>
        <div
          class="resize-handle resize-w"
          role="presentation"
          aria-hidden="true"
          onmousedown={(e) => handleResizeStart(e, 'w')}
        ></div>
        <div
          class="resize-handle resize-ne"
          role="presentation"
          aria-hidden="true"
          onmousedown={(e) => handleResizeStart(e, 'ne')}
        ></div>
        <div
          class="resize-handle resize-nw"
          role="presentation"
          aria-hidden="true"
          onmousedown={(e) => handleResizeStart(e, 'nw')}
        ></div>
        <div
          class="resize-handle resize-se"
          role="presentation"
          aria-hidden="true"
          onmousedown={(e) => handleResizeStart(e, 'se')}
        ></div>
        <div
          class="resize-handle resize-sw"
          role="presentation"
          aria-hidden="true"
          onmousedown={(e) => handleResizeStart(e, 'sw')}
        ></div>
      {/if}
    </div>
  </div>
{/if}
