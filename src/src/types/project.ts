export type QuoteStatus = "draft" | "sent" | "approved" | "in_work";

export type DoorType = "hidden" | "classic" | "sliding" | "entrance";
export type DoorHeight = "2050" | "2300" | "2500" | "2700" | "3000" | "custom";
export type DoorWidth = "600" | "700" | "800" | "900" | "custom";
export type Opening = "left" | "right" | "outside" | "inside";
export type FrameType = "hidden_aluminum" | "mdf" | "telescopic";
export type Finish = "ral" | "veneer" | "hpl" | "mirror" | "lacobel" | "primer";
export type DiscountType = "uah" | "percent";

export interface Client {
  name: string;
  phone: string;
  address: string;
  comment: string;
}

export interface DoorItem {
  id: string;
  room: string;
  type: DoorType;
  height: DoorHeight;
  customHeight: string;
  width: DoorWidth;
  customWidth: string;
  opening: Opening;
  frame: FrameType;
  finish: Finish;
  color: string;
  handle: string;
  hinges: string;
  lock: string;
  trim: boolean;
  extension: boolean;
  installation: boolean;
  delivery: boolean;
  discountType: DiscountType;
  discountValue: number;
  comment: string;
}

export interface Quote {
  id: string;
  number: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  manager: string;
  client: Client;
  items: DoorItem[];
}

export interface ItemCalculation {
  base: number;
  surcharges: number;
  hardware: number;
  services: number;
  subtotal: number;
  discount: number;
  total: number;
}

export interface QuoteCalculation {
  subtotal: number;
  discount: number;
  total: number;
  items: Record<string, ItemCalculation>;
}
