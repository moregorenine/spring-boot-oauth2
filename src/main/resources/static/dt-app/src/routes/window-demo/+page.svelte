<script lang="ts">
  import { Window } from '$lib/components/ui/window';
  import { Button } from '$lib/components/ui/button';

  let defaultOpen = $state(false);
  let alertOpen = $state(false);
  let fullscreenOpen = $state(false);
  let formOpen = $state(false);
  let nestedOpen = $state(false);
  let nestedInnerOpen = $state(false);
  let nonModalOpen1 = $state(false);
  let nonModalOpen2 = $state(false);
</script>

<div class="container mx-auto py-8 px-4">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-2">macOS Window Component</h1>
    <p class="text-muted-foreground">
      macOS Finder 스타일의 애니메이션을 가진 재사용 가능한 Window/Popup 컴포넌트입니다.
    </p>
  </div>

  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <!-- Default Window -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">기본 Window</h2>
      <p class="text-sm text-muted-foreground">
        기본 스타일의 팝업 창입니다. ESC 키 또는 오버레이 클릭으로 닫을 수 있습니다.
      </p>
      <Button onclick={() => (defaultOpen = true)}>기본 Window 열기</Button>
    </div>

    <!-- Alert Window -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Alert Window</h2>
      <p class="text-sm text-muted-foreground">
        작은 크기의 알림 스타일 창입니다. 중요한 메시지나 확인 대화상자에 적합합니다.
      </p>
      <Button onclick={() => (alertOpen = true)} variant="destructive">Alert 열기</Button>
    </div>

    <!-- Fullscreen Window -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Fullscreen Window</h2>
      <p class="text-sm text-muted-foreground">
        전체 화면 크기의 창입니다. 상세 정보나 복잡한 폼에 적합합니다.
      </p>
      <Button onclick={() => (fullscreenOpen = true)} variant="secondary">Fullscreen 열기</Button>
    </div>

    <!-- Form Window -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Form Window</h2>
      <p class="text-sm text-muted-foreground">
        폼 입력이 포함된 창입니다. Focus trap이 작동하여 키보드 네비게이션이 가능합니다.
      </p>
      <Button onclick={() => (formOpen = true)} variant="outline">Form Window 열기</Button>
    </div>

    <!-- Nested Window -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">중첩 Window</h2>
      <p class="text-sm text-muted-foreground">
        창 안에서 또 다른 창을 열 수 있습니다. Z-index가 자동으로 관리됩니다.
      </p>
      <Button onclick={() => (nestedOpen = true)}>중첩 Window 열기</Button>
    </div>

    <!-- Non-Modal Window 1 -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Non-Modal Window 1</h2>
      <p class="text-sm text-muted-foreground">
        부모 영역이 블러 처리되지 않고 클릭 가능한 창입니다. 배경과 상호작용이 필요할 때 유용합니다.
      </p>
      <Button onclick={() => (nonModalOpen1 = true)} variant="outline">Non-Modal1 열기</Button>
    </div>

    <!-- Non-Modal Window 2 -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Non-Modal Window 2</h2>
      <p class="text-sm text-muted-foreground">
        두 개의 non-modal 창을 동시에 열어 배경과 상호작용할 수 있습니다.
      </p>
      <Button onclick={() => (nonModalOpen2 = true)} variant="outline">Non-Modal2 열기</Button>
    </div>
  </div>

  <!-- Features Section -->
  <div class="mt-12 space-y-6">
    <h2 class="text-3xl font-bold">주요 기능</h2>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="p-4 border rounded-lg">
        <h3 class="font-semibold mb-2">🎨 macOS Finder 애니메이션</h3>
        <p class="text-sm text-muted-foreground">
          Scale + Fade 효과로 자연스러운 창 열림/닫힘 애니메이션을 제공합니다.
        </p>
      </div>
      <div class="p-4 border rounded-lg">
        <h3 class="font-semibold mb-2">⌨️ 키보드 접근성</h3>
        <p class="text-sm text-muted-foreground">
          ESC 키로 닫기, Tab 키로 포커스 이동, Focus trap 등 완벽한 키보드 지원을 제공합니다.
        </p>
      </div>
      <div class="p-4 border rounded-lg">
        <h3 class="font-semibold mb-2">🎯 Slot 기반 콘텐츠</h3>
        <p class="text-sm text-muted-foreground">
          Svelte의 Slot을 활용하여 어떤 콘텐츠든 자유롭게 주입할 수 있습니다.
        </p>
      </div>
      <div class="p-4 border rounded-lg">
        <h3 class="font-semibold mb-2">🔒 Body Scroll Lock</h3>
        <p class="text-sm text-muted-foreground">
          창이 열려있을 때 배경 스크롤을 자동으로 잠가 UX를 개선합니다.
        </p>
      </div>
    </div>
  </div>
</div>

<!-- Default Window -->
<Window bind:open={defaultOpen} title="기본 Window" width="600px">
  <div class="space-y-4">
    <h3 class="text-xl font-semibold">환영합니다!</h3>
    <p>
      이것은 macOS Finder 스타일의 기본 Window 컴포넌트입니다. 상단의 빨간색 버튼을 클릭하거나 ESC
      키를 눌러 닫을 수 있습니다.
    </p>
    <div class="p-4 bg-muted rounded-lg">
      <p class="text-sm">
        <strong>팁:</strong> 오버레이(배경)를 클릭해도 창이 닫힙니다. 이 기능은
        <code class="px-1 py-0.5 bg-background rounded">closeOnOverlay</code> prop으로 제어할 수 있습니다.
      </p>
    </div>
    <div class="flex gap-2 justify-end">
      <Button variant="outline" onclick={() => (defaultOpen = false)}>취소</Button>
      <Button onclick={() => (defaultOpen = false)}>확인</Button>
    </div>
  </div>
</Window>

<!-- Alert Window -->
<Window bind:open={alertOpen} title="경고" variant="alert">
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <span class="text-2xl">⚠️</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold">정말 삭제하시겠습니까?</h3>
        <p class="text-sm text-muted-foreground">이 작업은 되돌릴 수 없습니다.</p>
      </div>
    </div>
    <div class="flex gap-2 justify-end">
      <Button variant="outline" onclick={() => (alertOpen = false)}>취소</Button>
      <Button variant="destructive" onclick={() => (alertOpen = false)}>삭제</Button>
    </div>
  </div>
</Window>

<!-- Fullscreen Window -->
<Window bind:open={fullscreenOpen} title="전체화면 Window" variant="fullscreen">
  <div class="space-y-6">
    <h3 class="text-2xl font-bold">전체화면 모드</h3>
    <p>이 창은 전체 화면 크기로 표시됩니다. 복잡한 데이터나 상세 정보를 표시할 때 유용합니다.</p>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each Array(12) as _, i}
        <div class="p-6 border rounded-lg">
          <h4 class="font-semibold mb-2">카드 {i + 1}</h4>
          <p class="text-sm text-muted-foreground">
            전체화면에서는 더 많은 콘텐츠를 효과적으로 표시할 수 있습니다.
          </p>
        </div>
      {/each}
    </div>

    <div class="flex justify-end">
      <Button onclick={() => (fullscreenOpen = false)}>닫기</Button>
    </div>
  </div>
</Window>

<!-- Form Window -->
<Window bind:open={formOpen} title="사용자 정보 입력" width="500px">
  <form class="space-y-4" onsubmit={(e) => e.preventDefault()}>
    <div class="space-y-2">
      <label for="name" class="text-sm font-medium">이름</label>
      <input
        id="name"
        type="text"
        class="w-full px-3 py-2 border rounded-md"
        placeholder="홍길동"
      />
    </div>
    <div class="space-y-2">
      <label for="email" class="text-sm font-medium">이메일</label>
      <input
        id="email"
        type="email"
        class="w-full px-3 py-2 border rounded-md"
        placeholder="example@email.com"
      />
    </div>
    <div class="space-y-2">
      <label for="message" class="text-sm font-medium">메시지</label>
      <textarea
        id="message"
        class="w-full px-3 py-2 border rounded-md"
        rows="4"
        placeholder="메시지를 입력하세요..."
      ></textarea>
    </div>
    <div class="flex gap-2 justify-end">
      <Button type="button" variant="outline" onclick={() => (formOpen = false)}>취소</Button>
      <Button type="submit" onclick={() => (formOpen = false)}>제출</Button>
    </div>
  </form>
</Window>

<!-- Nested Window -->
<Window bind:open={nestedOpen} title="부모 Window" width="700px">
  <div class="space-y-4">
    <h3 class="text-xl font-semibold">중첩된 Window</h3>
    <p>이 창 안에서 또 다른 창을 열 수 있습니다. Z-index가 자동으로 관리됩니다.</p>
    <div class="p-4 bg-muted rounded-lg">
      <p class="text-sm mb-4">
        아래 버튼을 클릭하면 이 창 위에 새로운 창이 열립니다. 각 창은 독립적으로 관리되며, ESC 키는
        가장 위의 창부터 닫습니다.
      </p>
      <Button onclick={() => (nestedInnerOpen = true)}>내부 Window 열기</Button>
    </div>
    <div class="flex justify-end">
      <Button variant="outline" onclick={() => (nestedOpen = false)}>닫기</Button>
    </div>
  </div>
</Window>

<!-- Nested Inner Window -->
<Window bind:open={nestedInnerOpen} title="자식 Window" width="500px">
  <div class="space-y-4">
    <h3 class="text-xl font-semibold">내부 Window</h3>
    <p>이것은 부모 창 위에 열린 자식 창입니다.</p>
    <div class="p-4 bg-primary/10 rounded-lg">
      <p class="text-sm">
        <strong>참고:</strong> ESC 키를 누르면 이 창이 먼저 닫히고, 다시 누르면 부모 창이 닫힙니다.
      </p>
    </div>
    <div class="flex justify-end">
      <Button onclick={() => (nestedInnerOpen = false)}>닫기</Button>
    </div>
  </div>
</Window>

<!-- Non-Modal Window 1 -->
<Window bind:open={nonModalOpen1} title="Non-Modal Window 1" width="500px" modal={false}>
  <div class="space-y-4">
    <h3 class="text-xl font-semibold">Non-Modal 모드 1</h3>
    <p>
      이 창은 <code class="px-1 py-0.5 bg-muted rounded">modal={false}</code>로 설정되어 있습니다.
      배경이 블러 처리되지 않고, 부모 영역을 클릭할 수 있습니다.
    </p>
    <div class="p-4 bg-primary/10 rounded-lg">
      <p class="text-sm">
        <strong>테스트:</strong> 이 창이 열려있는 상태에서 배경의 다른 버튼들을 클릭해보세요. 배경이 투명하고
        클릭이 가능합니다!
      </p>
    </div>
    <div class="p-4 bg-muted rounded-lg">
      <p class="text-sm mb-2"><strong>주요 특징:</strong></p>
      <ul class="text-sm space-y-1 list-disc list-inside">
        <li>배경 블러 효과 없음</li>
        <li>투명한 오버레이</li>
        <li>부모 영역 클릭 가능</li>
        <li>ESC 키로 닫기 가능</li>
      </ul>
    </div>
    <div class="flex justify-end">
      <Button onclick={() => (nonModalOpen1 = false)}>닫기</Button>
    </div>
  </div>
</Window>

<!-- Non-Modal Window 2 -->
<Window bind:open={nonModalOpen2} title="Non-Modal Window 2" width="500px" modal={false}>
  <div class="space-y-4">
    <h3 class="text-xl font-semibold">Non-Modal 모드 2</h3>
    <p>두 개의 non-modal 창을 동시에 열어 배경과 상호작용할 수 있습니다.</p>
    <div class="p-4 bg-secondary/10 rounded-lg">
      <p class="text-sm">
        <strong>다중 윈도우:</strong> Non-Modal1과 Non-Modal2를 동시에 열어보세요. 두 창 모두 배경을 가리지
        않고 독립적으로 작동합니다!
      </p>
    </div>
    <div class="p-4 bg-muted rounded-lg">
      <p class="text-sm mb-2"><strong>활용 사례:</strong></p>
      <ul class="text-sm space-y-1 list-disc list-inside">
        <li>도구 팔레트 (Tool Palette)</li>
        <li>속성 패널 (Properties Panel)</li>
        <li>미니 플레이어 (Mini Player)</li>
        <li>알림 토스트 (Notification Toast)</li>
      </ul>
    </div>
    <div class="flex justify-end">
      <Button onclick={() => (nonModalOpen2 = false)}>닫기</Button>
    </div>
  </div>
</Window>

<style>
  .container {
    max-width: 1200px;
  }

  code {
    font-family: 'Fira Mono', monospace;
    font-size: 0.875em;
  }
</style>
