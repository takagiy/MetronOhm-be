import { JudgeInfo } from './judge-info';


export interface SlideJudgeInfo extends JudgeInfo {
  lane: number;
  point: number;
}
