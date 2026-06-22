import { createDoorItem } from "../lib/factories";
import type { DoorHeight, DoorType, Quote } from "../types/project";

const now = new Date().toISOString();

export const sampleQuotes: Quote[] = [
  {
    id: "sample-uzhgorod-flat",
    number: "LP-2026-1001",
    status: "draft",
    createdAt: now,
    updatedAt: now,
    manager: "Олена Марчук",
    client: {
      name: "Квартира в Ужгороді",
      phone: "050 150 70 70",
      address: "Ужгород, ЖК Central Park",
      comment: "5 прихованих дверей в єдиному кольорі RAL 9010."
    },
    items: ["Спальня", "Ванна", "Кухня", "Гардероб", "Кабінет"].map((room, index) =>
      createDoorItem({
        id: `flat-door-${index + 1}`,
        room,
        type: "hidden",
        height: index === 3 ? "2500" : "2300",
        width: index === 1 ? "700" : "800",
        finish: "ral",
        color: "RAL 9010",
        delivery: index === 0,
        installation: true
      })
    )
  },
  {
    id: "sample-house",
    number: "LP-2026-1002",
    status: "sent",
    createdAt: now,
    updatedAt: now,
    manager: "Андрій Коваль",
    client: {
      name: "Приватний будинок",
      phone: "075 150 70 70",
      address: "с. Минай, Закарпаття",
      comment: "8 дверей різної висоти, частина з телескопічним коробом."
    },
    items: ([
      ["Хол", "classic", "2300"],
      ["Спальня", "hidden", "2500"],
      ["Дитяча", "classic", "2050"],
      ["Ванна", "hidden", "2300"],
      ["Гардероб", "sliding", "2700"],
      ["Кабінет", "classic", "2500"],
      ["Кухня", "hidden", "2300"],
      ["Вхід", "entrance", "2300"]
    ] satisfies Array<[string, DoorType, DoorHeight]>).map(([room, type, height], index) =>
      createDoorItem({
        id: `house-door-${index + 1}`,
        room,
        type,
        height,
        frame: index % 2 ? "hidden_aluminum" : "telescopic",
        finish: index === 7 ? "hpl" : "veneer",
        color: index === 7 ? "HPL Graphite" : "Натуральний дуб",
        width: index === 7 ? "900" : "800",
        trim: type === "classic",
        extension: index % 3 === 0,
        delivery: index === 0,
        installation: true
      })
    )
  },
  {
    id: "sample-design",
    number: "LP-2026-1003",
    status: "approved",
    createdAt: now,
    updatedAt: now,
    manager: "Ірина Савчук",
    client: {
      name: "Дизайнерський проєкт",
      phone: "066 53 73 112",
      address: "Ужгород, приватні апартаменти",
      comment: "Акцентні полотна: бронзове дзеркало та HPL."
    },
    items: [
      createDoorItem({
        id: "design-1",
        room: "Гардероб",
        type: "sliding",
        height: "2700",
        width: "custom",
        customWidth: "1100",
        finish: "mirror",
        color: "Дзеркало бронза",
        discountType: "percent",
        discountValue: 5,
        delivery: true
      }),
      createDoorItem({
        id: "design-2",
        room: "Кухня",
        type: "hidden",
        height: "3000",
        finish: "hpl",
        color: "HPL Warm Grey",
        delivery: false
      }),
      createDoorItem({
        id: "design-3",
        room: "Спальня",
        type: "hidden",
        height: "custom",
        customHeight: "2850",
        finish: "lacobel",
        color: "Лакобель шампань"
      })
    ]
  }
];
