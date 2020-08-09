export interface IInventoryTimeLine {
  productInventorySnapshot: any;
}

export interface ISnapshot {
  productId: number;
  quantityOnHand: number[];
}