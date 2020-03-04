import * as os from "os";

export const playSound =
  os.platform() == "win32"
    ? require("ffi").Library("winmm", {
        PlaySound: ["bool", ["string", "pointer", "int32"]]
      }).PlaySound
    : (null as any);

export const SND_ASYNC = 0x0001;
export const SND_FILENAME = 0x00020000;
