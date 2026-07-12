import { Token } from "./types";

export function normalizeReading(value: string): string {
  return value.trim().replace(/\s+/g, "");
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
