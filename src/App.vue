<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useGamepad } from './composables/useGamepad';

const { LeftX, LeftY, isConnected, RT, tick } = useGamepad();

const canvas = ref<HTMLCanvasElement>();

let context: CanvasRenderingContext2D | null | undefined = null;
let delta = 0;
let oldTime = performance.now();

const boxPositions = [10, 10] as [number, number];
const boxDimesions = [50, 50] as [number, number];
const boxSpeed = 200;
const turboMultiplier = 5;

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

   if (isConnected.value) {
      tick();
      context.fillStyle = 'red';
      context.fillRect(...boxPositions, ...boxDimesions);

      boxPositions[0] += boxSpeed * Math.max(RT.value * turboMultiplier, 1) * clampAxis(LeftX.value) * delta;
      boxPositions[1] += boxSpeed * Math.max(RT.value * turboMultiplier, 1) * clampAxis(LeftY.value) * delta;
   }

   requestAnimationFrame(startGame);
}

onMounted(() => {
   if (!canvas.value) return;
   context = canvas.value.getContext('2d');
   requestAnimationFrame(startGame);
});
</script>

<template>
   <ul>
      <li>isConnected 1: {{ isConnected }}</li>
   </ul>
   <canvas width="1365" height="800" ref="canvas"></canvas>
</template>

<style lang="scss">
.bold {
   font-weight: 600;
}

body {
   margin: 0;
}
</style>
