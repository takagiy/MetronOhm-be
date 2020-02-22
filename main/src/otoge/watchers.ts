import { LaneWatcher } from "./lane-watcher";
import { SlideWatcher } from "./slide-watcher";

export interface Watchers {
  laneWatchers: [LaneWatcher, LaneWatcher, LaneWatcher, LaneWatcher];
  slideWatchers: [SlideWatcher, SlideWatcher, SlideWatcher, SlideWatcher];
}
