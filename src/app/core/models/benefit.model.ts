export interface ClientDiscretionaryDiscount {
  discountId: number;
  name: string;
  detail: string;
  active: boolean;
  limitPrice: number;
  modifiedBy: string;
  validityTo: string;
  updatedTime: string;
  discountType: string;
  amountDiscount: DiscountValues[];
}

export interface DiscountValues {
  amount: string;
  scale: ScaleValues;
}
export interface ScaleValues {
  escaleQtyMin: number;
  escaleQtyMax: number;
}
