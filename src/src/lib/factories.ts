import type { DoorItem, Quote } from "../types/project";

export const createDoorItem = (overrides: Partial<DoorItem> = {}): DoorItem => ({
  id: crypto.randomUUID(),
  room: "Спальня",
  type: "hidden",
  height: "2300",
  customHeight: "",
  width: "800",
  customWidth: "",
  opening: "right",
  frame: "hidden_aluminum",
  finish: "ral",
  color: "RAL 9010",
  handle: "Базова прихована ручка",
  hinges: "Приховані петлі",
  lock: "Магнітний замок",
  trim: false,
  extension: false,
  installation: true,
  delivery: false,
  discountType: "uah",
  discountValue: 0,
  comment: "",
  ...overrides
});

export const createQuote = (): Quote => {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    number: `LP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    manager: "Менеджер La Porte",
    client: {
      name: "",
      phone: "",
      address: "",
      comment: ""
    },
    items: [createDoorItem()]
  };
};
