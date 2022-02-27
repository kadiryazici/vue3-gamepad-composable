import { ref } from 'vue';

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
   gamepadIndex?: number;
   autostart?: boolean;
}

const isTriggerButton = (index: number) => index === 6 || index === 7;

export function useGamepad({
   gamepadIndex = 0, //
   autostart = true,
}: IGamepadOptions = {}) {
   let activeAnimationFrame = -1;

   const A = ref(false);
   const B = ref(false);
   const X = ref(false);
   const Y = ref(false);
   const LB = ref(false);
   const RB = ref(false);
   const LR = ref(0);
   const LT = ref(0);
   const Back = ref(false);
   const Start = ref(false);
   const LSB = ref(false);
   const RSB = ref(false);
   const Up = ref(false);
   const Down = ref(false);
   const Left = ref(false);
   const Right = ref(false);
   const XboxKey = ref(false);
   const isGamepadConnected = ref(false);

   const LeftX = ref(0);
   const LeftY = ref(0);
   const RightX = ref(0);
   const RightY = ref(0);

   const stopLoop = () => {
      cancelAnimationFrame(activeAnimationFrame);
      activeAnimationFrame = -1;
   };
   const startLoop = () => {
      activeAnimationFrame = requestAnimationFrame(gameLoop);
   };

   const buttons = [A, B, X, Y, LB, RB, LR, LT, Back, Start, LSB, RSB, Up, Down, Left, Right, XboxKey];
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

   function loopRestartOnFailure() {
      activeAnimationFrame = requestAnimationFrame(gameLoop);
      isGamepadConnected.value = false;
      resetState();
   }

   function gameLoop() {
      if (!isBrowser()) return;

      const gamepads = navigator.getGamepads();
      if (gamepads.length === 0) return loopRestartOnFailure();

      const gamepad = gamepads[gamepadIndex]!;
      if (!gamepad) return loopRestartOnFailure();

      gamepad.buttons.forEach(({ pressed, value }, index) => {
         buttons[index].value = isTriggerButton(index) ? value : pressed;
      });

      gamepad.axes.forEach((axis, index) => {
         axes[index].value = axis;
      });

      activeAnimationFrame = requestAnimationFrame(gameLoop);
   }

   if (autostart) {
      activeAnimationFrame = requestAnimationFrame(gameLoop);
   }

   return {
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
      isGamepadConnected,
      LeftX,
      LeftY,
      RightX,
      RightY,
      stopLoop,
      startLoop,
   };
}
