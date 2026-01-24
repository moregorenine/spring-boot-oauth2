<script lang="ts">
  import type { WindowTitlebarProps } from './types';
  import './window.scss';

  let {
    title = '',
    onClose,
    onMaximize,
    showMaximize = true,
    isMaximized = false,
    onDragStart
  }: WindowTitlebarProps = $props();

  function handleClose() {
    onClose?.();
  }

  function handleMaximize() {
    onMaximize?.();
  }

  function handleMouseDown(e: MouseEvent) {
    // Don't start drag if clicking on buttons
    if ((e.target as HTMLElement).closest('.window-control-btn')) {
      return;
    }
    onDragStart?.(e);
  }
</script>

<div
  class="window-titlebar"
  class:draggable={!isMaximized}
  onmousedown={handleMouseDown}
  role="button"
  tabindex="0"
  aria-label="윈도우 제목 표시줄"
>
  <div style="width: 92px;"></div>
  <!-- Spacer for centering title -->
  {#if title}
    <div class="window-title">{title}</div>
  {/if}
  <div class="window-controls">
    {#if showMaximize}
      <button
        class="window-control-btn window-control-maximize"
        class:is-maximized={isMaximized}
        onclick={handleMaximize}
        aria-label={isMaximized ? '복원' : '최대화'}
        type="button"
      ></button>
    {/if}
    <button
      class="window-control-btn window-control-close"
      onclick={handleClose}
      aria-label="닫기"
      type="button"
    ></button>
  </div>
</div>
