<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import { WindowEvents } from 'vue3-window-events';
import { useGamepad } from './composables/useGamepad';

const { LeftX, LeftY, RightX, RightY } = useGamepad();
const canvas = ref<HTMLCanvasElement>();

let context: CanvasRenderingContext2D | null | undefined = null;
let delta = 0;
let oldTime = performance.now();
const boxPositions = [10, 10] as [number, number];
const boxDimesions = [10, 10] as [number, number];

watchEffect(
   () => {
      context = canvas.value?.getContext('2d');
   },
   {
      flush: 'sync',
   },
);

const clampAxis = (value: number) => (Math.abs(value) < 0.15 ? 0 : value);

function startGame() {
   if (!context || !canvas.value) return requestAnimationFrame(startGame);

   const newTime = performance.now();
   delta = (newTime - oldTime) / 1000;
   oldTime = newTime;

   context.clearRect(0, 0, canvas.value.width, canvas.value.height);
   context.fillStyle = 'red';
   context.fillRect(...boxPositions, ...boxDimesions);

   boxPositions[0] += 100 * clampAxis(LeftX.value) * delta;
   boxPositions[1] += 100 * clampAxis(LeftY.value) * delta;

   requestAnimationFrame(startGame);
}

onMounted(() => {
   if (!canvas.value) return;
   context = canvas.value.getContext('2d');
   startGame();
});
</script>

<template>
   <ul>
      <li>A Pressed: {{ A }}</li>
   </ul>
   <canvas width="500" height="500" ref="canvas"></canvas>
</template>

<style lang="scss">
.bold {
   font-weight: 600;
}
</style>
