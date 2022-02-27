<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useGamepad } from './composables/useGamepad';

const { LeftX, LeftY, isConnected, tick } = useGamepad();
const { isConnected: isConnected2, LeftX: LeftX2, LeftY: LeftY2, tick: tick2 } = useGamepad({ index: 1 });

const canvas = ref<HTMLCanvasElement>();

let context: CanvasRenderingContext2D | null | undefined = null;
let delta = 0;
let oldTime = performance.now();

const boxPositions = [10, 10] as [number, number];
const boxPositions2 = [50, 50] as [number, number];
const boxDimesions = [50, 50] as [number, number];
const boxSpeed = 200;

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

      boxPositions[0] += boxSpeed * clampAxis(LeftX.value) * delta;
      boxPositions[1] += boxSpeed * clampAxis(LeftY.value) * delta;
   }

   if (isConnected2.value) {
      tick2();
      context.fillStyle = 'blue';
      context.fillRect(...boxPositions2, ...boxDimesions);
      boxPositions2[0] += boxSpeed * clampAxis(LeftX2.value) * delta;
      boxPositions2[1] += boxSpeed * clampAxis(LeftY2.value) * delta;
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
      <li>isConnected 2: {{ isConnected2 }}</li>
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
