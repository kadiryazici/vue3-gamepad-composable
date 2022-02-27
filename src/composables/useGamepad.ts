import { computed, ref } from 'vue';

export const enum XboxButtons {
   A,
   B,
   X,
   Y,
   LB,
   RB,
   LR,
   LT,
   Back,
   Start,
   LSB,
   RSB,
   Up,
   Down,
   Left,
   Right,
   XboxKey,
}

export enum XboxAxes {
   LeftX,
   LeftY,
   RightX,
   RightY,
}

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

interface IGamepadOptions {
   index?: number;
}

const isTriggerButton = (index: number) => index === 6 || index === 7;

export function useGamepad({
   index: gamepadIndex = 0, //
}: IGamepadOptions = {}) {
   const A = ref(false);
   const B = ref(false);
   const X = ref(false);
   const Y = ref(false);
   const LB = ref(false);
   const RB = ref(false);
   const LT = ref(0);
   const RT = ref(0);
   const Back = ref(false);
   const Start = ref(false);
   const LSB = ref(false);
   const RSB = ref(false);
   const Up = ref(false);
   const Down = ref(false);
   const Left = ref(false);
   const Right = ref(false);
   const XboxKey = ref(false);

   const LeftX = ref(0);
   const LeftY = ref(0);
   const RightX = ref(0);
   const RightY = ref(0);

   const isConnected = ref(false);
   if (isBrowser()) {
      window.addEventListener('gamepadconnected', (e) => {
         if (e.gamepad.index === gamepadIndex) isConnected.value = true;
      });

      window.addEventListener('gamepaddisconnected', (e) => {
         if (e.gamepad.index === gamepadIndex) isConnected.value = false;
      });
   }

   const buttons = [A, B, X, Y, LB, RB, LT, RT, Back, Start, LSB, RSB, Up, Down, Left, Right, XboxKey];
   const axes = [LeftX, LeftY, RightX, RightY];

   function resetState() {
      buttons.forEach((button, index) => {
         if (isTriggerButton(index)) button.value = 0;
         else button.value = false;
      });

      for (const axis of axes) {
         axis.value = 0;
      }
   }

   function tick() {
      const gamepads = navigator.getGamepads();
      if (gamepads.length === 0) return resetState();

      const gamepad = gamepads[gamepadIndex]!;
      if (!gamepad) return resetState();

      gamepad.buttons.forEach(({ pressed, value }, index) => {
         buttons[index].value = isTriggerButton(index) ? value : pressed;
      });

      gamepad.axes.forEach((axis, index) => {
         axes[index].value = axis;
      });
   }

   return {
      A: computed(() => A.value),
      B: computed(() => B.value),
      X: computed(() => X.value),
      Y: computed(() => Y.value),
      LB: computed(() => LB.value),
      RB: computed(() => RB.value),
      RT: computed(() => RT.value),
      LT: computed(() => LT.value),
      Back: computed(() => Back.value),
      Start: computed(() => Start.value),
      LSB: computed(() => LSB.value),
      RSB: computed(() => RSB.value),
      Up: computed(() => Up.value),
      Down: computed(() => Down.value),
      Left: computed(() => Left.value),
      Right: computed(() => Right.value),
      XboxKey: computed(() => XboxKey.value),
      LeftX: computed(() => LeftX.value),
      LeftY: computed(() => LeftY.value),
      RightX: computed(() => RightX.value),
      RightY: computed(() => RightY.value),
      isConnected: computed(() => isConnected.value),
      tick,
   };
}
