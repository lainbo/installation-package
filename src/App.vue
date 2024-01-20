<template>
  <div class="fixed inset-0">
    <button
      class="icon-btn absolute right-3 top-3 z-1 text-22px dark:text-white"
      @click="toggleDark()"
    >
      <div i-ph-sun-bold dark:i-ph-moon-bold />
    </button>
    <div
      class="main-content absolute inset-0 h-100dvh flex-c flex-col bg-#fff dark:bg-black"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div class="jumbo absolute opacity-50 -inset-[10px]" />
      </div>
    </div>
    <MainView />
  </div>
</template>

<script setup>
import MainView from '@/views/MainView.vue'
const isDark = useDark()
const toggleDark = useToggle(isDark)
const 当前颜色模式 = useColorMode()
const bodyDom = document.body
function changeArcoTheme(theme) {
  theme === 'dark'
    ? bodyDom.setAttribute('arco-theme', 'dark')
    : bodyDom.removeAttribute('arco-theme')
}

watchEffect(() => {
  changeArcoTheme(当前颜色模式.value)
})
</script>

<style lang="scss" scoped>
.main-content {
  height: 100vh;
  height: calc(var(--1dvh, 1vh) * 100);
  height: 100dvh;
}

@keyframes jumbo {
  from {
    background-position:
      50% 50%,
      50% 50%;
  }

  to {
    background-position:
      350% 50%,
      350% 50%;
  }
}

.jumbo {
  --stripes: repeating-linear-gradient(
    100deg,
    #fff 0%,
    #fff 7%,
    transparent 10%,
    transparent 12%,
    #fff 16%
  );
  --stripes-dark: repeating-linear-gradient(
    100deg,
    #000 0%,
    #000 7%,
    transparent 10%,
    transparent 12%,
    #000 16%
  );
  --rainbow: repeating-linear-gradient(
    100deg,
    #60a5fa 10%,
    #e879f9 15%,
    #60a5fa 20%,
    #5eead4 25%,
    #60a5fa 30%
  );

  background-image: var(--stripes), var(--rainbow);
  background-size: 300%, 200%;
  background-position:
    50% 50%,
    50% 50%;
  filter: blur(10px) invert(100%);
  mask-image: radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%);
  pointer-events: none;
}

.jumbo::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--stripes), var(--rainbow);
  background-size: 200%, 100%;
  animation: jumbo 60s linear infinite;
  background-attachment: fixed;
  mix-blend-mode: difference;
}

.dark .jumbo {
  background-image: var(--stripes-dark), var(--rainbow);
  filter: blur(10px) opacity(50%) saturate(200%);
}

.dark .jumbo::after {
  background-image: var(--stripes-dark), var(--rainbow);
}
</style>
