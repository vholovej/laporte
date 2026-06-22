import pricing from "../data/pricing.json";
import type { DoorItem, ItemCalculation, Quote, QuoteCalculation } from "../types/project";

export const calculateItem = (item: DoorItem): ItemCalculation => {
  const base = pricing.doorTypes[item.type];
  const heightExtra =
    item.height === "2050" || item.height === "2300" ? 0 : pricing.heightSurcharge[item.height];
  const widthExtra = item.width === "custom" ? pricing.customWidthSurcharge : 0;
  const frameExtra = pricing.frames[item.frame];
  const finishExtra = pricing.finishes[item.finish];
  const hardware =
    pricing.hardware.baseHandle +
    pricing.hardware.hiddenHinges +
    pricing.hardware.magneticLock +
    (item.trim ? pricing.hardware.trim : 0) +
    (item.extension ? pricing.hardware.extension : 0);
  const services =
    (item.installation ? pricing.services.installation : 0) +
    (item.delivery ? pricing.services.delivery : 0);
  const surcharges = heightExtra + widthExtra + frameExtra + finishExtra;
  const subtotal = base + surcharges + hardware + services;
  const rawDiscount =
    item.discountType === "percent" ? subtotal * (Number(item.discountValue) / 100) : Number(item.discountValue);
  const discount = Math.min(Math.max(rawDiscount || 0, 0), subtotal);

  return {
    base,
    surcharges,
    hardware,
    services,
    subtotal,
    discount,
    total: subtotal - discount
  };
};

export const calculateQuote = (quote: Quote): QuoteCalculation => {
  const items = Object.fromEntries(quote.items.map((item) => [item.id, calculateItem(item)]));
  const subtotal = Object.values(items).reduce((sum, item) => sum + item.subtotal, 0);
  const discount = Object.values(items).reduce((sum, item) => sum + item.discount, 0);

  return {
    subtotal,
    discount,
    total: subtotal - discount,
    items
  };
};
