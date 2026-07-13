import { Token } from "./types";
import { hangulReadingToRomaji } from "./romaji";

export function normalizeReading(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

export function normalizeRomaji(value: string): string {
  return value.trim().replace(/\s+/g, "").toLowerCase();
}

export function getTokenRomaji(token: Token): string {
  return hangulReadingToRomaji(token.reading);
}

export function splitStem(token: Token): { stem: string; rest: string } {
  const candidate = token.meta?.root ?? token.meta?.word;
  if (candidate && token.surface.startsWith(candidate)) {
    return { stem: candidate, rest: token.surface.slice(candidate.length) };
  }
  return { stem: token.surface, rest: "" };
}

export function splitReadingStem(token: Token): { stem: string; rest: string } {
  const candidate = token.meta?.readingRoot;
  if (candidate && token.reading.startsWith(candidate)) {
    return { stem: candidate, rest: token.reading.slice(candidate.length) };
  }
  return { stem: token.reading, rest: "" };
}

export function splitRomajiStem(token: Token): { stem: string; rest: string } {
  const fullRomaji = hangulReadingToRomaji(token.reading);
  const readingRoot = token.meta?.readingRoot;
  if (readingRoot && token.reading.startsWith(readingRoot)) {
    const stemRomaji = hangulReadingToRomaji(readingRoot);
    if (fullRomaji.startsWith(stemRomaji)) {
      return { stem: stemRomaji, rest: fullRomaji.slice(stemRomaji.length) };
    }
  }
  return { stem: fullRomaji, rest: "" };
}
