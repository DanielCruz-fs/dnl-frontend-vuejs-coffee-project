import { IInventoryTimeLine } from "../InventoryGraph";

export interface IState {
  snapshotTimeLine: IInventoryTimeLine;
  isTimelineBuilt: boolean;
}