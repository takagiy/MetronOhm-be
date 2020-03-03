import * as ffi from "ffi";

const winmm = ffi.Library("winmm", {
  PlaySound: ["bool", ["string", "pointer", "int32"]]
});

export const playSound = winmm.PlaySound;

export const SND_ASYNC = 0x0001;
export const SND_FILENAME = 0x00020000;
