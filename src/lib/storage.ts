import { sampleQuotes } from "../data/sampleQuotes";
import type { Quote } from "../types/project";

const STORAGE_KEY = "la-porte-quotes-v1";

export const loadQuotes = (): Quote[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleQuotes));
      return sampleQuotes;
    }

    return JSON.parse(raw) as Quote[];
  } catch {
    return sampleQuotes;
  }
};

export const saveQuotes = (quotes: Quote[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
};
