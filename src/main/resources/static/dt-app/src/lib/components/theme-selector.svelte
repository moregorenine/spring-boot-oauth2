<script lang="ts">
  import { themeStore, themes, type Theme } from '$lib/stores/theme.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Palette, Check } from '@lucide/svelte';

  let currentTheme = $state<Theme>('default-light');

  // 스토어 구독
  themeStore.subscribe((theme) => {
    currentTheme = theme;
  });

  function selectTheme(theme: Theme) {
    themeStore.setTheme(theme);
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="sm" class="w-full justify-start gap-2 px-2">
        <Palette class="h-4 w-4" />
        <span class="flex-1 text-left">테마 설정</span>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-80 p-4" side="right" align="start">
    <div class="space-y-4">
      <div class="space-y-2">
        <h4 class="font-semibold text-sm">테마 선택</h4>
        <p class="text-xs text-muted-foreground">원하는 테마를 선택하여 인터페이스를 변경하세요</p>
      </div>

      <div class="grid gap-3">
        {#each themes as theme}
          {@const isSelected = currentTheme === theme.id}
          <button
            onclick={() => selectTheme(theme.id)}
            class="group relative flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:border-primary hover:shadow-md {isSelected
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border bg-card'}"
          >
            <!-- 테마 컬러 프리뷰 -->
            <div class="flex flex-col gap-1 pt-1">
              <div
                class="h-3 w-3 rounded-full border-2 border-background shadow-sm"
                style="background-color: {theme.preview.primary};"
              ></div>
              <div
                class="h-3 w-3 rounded-full border-2 border-background shadow-sm"
                style="background-color: {theme.preview.accent};"
              ></div>
            </div>

            <!-- 테마 정보 -->
            <div class="flex-1 space-y-1">
              <div class="flex items-center justify-between">
                <p class="font-medium text-sm leading-none">
                  {theme.name}
                </p>
                {#if isSelected}
                  <Check class="h-4 w-4 text-primary" />
                {/if}
              </div>
              <p class="text-xs text-muted-foreground">
                {theme.description}
              </p>
            </div>
          </button>
        {/each}
      </div>
    </div>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<style>
  button {
    cursor: pointer;
  }
</style>
