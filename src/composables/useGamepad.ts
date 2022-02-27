import { shallowReadonly, shallowRef } from 'vue';

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
   const A = shallowRef(false);
   const B = shallowRef(false);
   const X = shallowRef(false);
   const Y = shallowRef(false);
   const LB = shallowRef(false);
   const RB = shallowRef(false);
   const LT = shallowRef(0);
   const RT = shallowRef(0);
   const Back = shallowRef(false);
   const Start = shallowRef(false);
   const LSB = shallowRef(false);
   const RSB = shallowRef(false);
   const Up = shallowRef(false);
   const Down = shallowRef(false);
   const Left = shallowRef(false);
   const Right = shallowRef(false);
   const XboxKey = shallowRef(false);

   const LeftX = shallowRef(0);
   const LeftY = shallowRef(0);
   const RightX = shallowRef(0);
   const RightY = shallowRef(0);

   const isConnected = shallowRef(false);
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
      A: shallowReadonly(A),
      B: shallowReadonly(B),
      X: shallowReadonly(X),
      Y: shallowReadonly(Y),
      LB: shallowReadonly(LB),
      RB: shallowReadonly(RB),
      RT: shallowReadonly(RT),
      LT: shallowReadonly(LT),
      Back: shallowReadonly(Back),
      Start: shallowReadonly(Start),
      LSB: shallowReadonly(LSB),
      RSB: shallowReadonly(RSB),
      Up: shallowReadonly(Up),
      Down: shallowReadonly(Down),
      Left: shallowReadonly(Left),
      Right: shallowReadonly(Right),
      XboxKey: shallowReadonly(XboxKey),
      LeftX: shallowReadonly(LeftX),
      LeftY: shallowReadonly(LeftY),
      RightX: shallowReadonly(RightX),
      RightY: shallowReadonly(RightY),
      isConnected: shallowReadonly(isConnected),
      tick,
   };
}
