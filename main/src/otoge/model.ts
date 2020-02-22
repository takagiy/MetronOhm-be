import { Play } from "./play";
import { MusicStore } from "./music-store";

export type OtogeState = "title/result" | "selectMusic" | "playing";

export class OtogeModel {
  nowPlaying: Play | null;
  musicStore: MusicStore;
  state: OtogeState;

  constructor(storePath: string) {
    this.musicStore = new MusicStore(storePath);
    this.nowPlaying = null;
    this.state = "title/result";
  }

  setState(state: OtogeState) {
    this.state = state;
    console.log(`set state ${state}`);
  }
}
