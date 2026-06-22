import type { DoorType, Finish, FrameType, Opening, QuoteStatus } from "../types/project";

export const statusLabels: Record<QuoteStatus, string> = {
  draft: "Чернетка",
  sent: "Надіслано",
  approved: "Погоджено",
  in_work: "В роботі"
};

export const doorTypeLabels: Record<DoorType, string> = {
  hidden: "Прихованого монтажу",
  classic: "Класичні з лиштвою",
  sliding: "Розсувні",
  entrance: "Вхідні"
};

export const openingLabels: Record<Opening, string> = {
  left: "Ліве",
  right: "Праве",
  outside: "Назовні",
  inside: "Всередину"
};

export const frameLabels: Record<FrameType, string> = {
  hidden_aluminum: "Прихований алюмінієвий",
  mdf: "МДФ",
  telescopic: "Телескопічний"
};

export const finishLabels: Record<Finish, string> = {
  ral: "Фарбування RAL",
  veneer: "Шпон",
  hpl: "HPL",
  mirror: "Дзеркало",
  lacobel: "Лакобель",
  primer: "Грунт під фарбування"
};

export const roomOptions = ["Спальня", "Ванна", "Кухня", "Гардероб", "Дитяча", "Кабінет", "Інше"];

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
