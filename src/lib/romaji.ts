const HANGUL_BASE = 0xac00;
const JUNG_COUNT = 21;
const JONG_COUNT = 28;

/**
 * Maps each Korean syllable (no batchim) used in this project's phonetic
 * `reading` transcriptions to its Hepburn romaji mora. Long vowels are
 * represented in `reading` by doubling the vowel syllable (e.g. 포+오 for
 * ぽう); since that doubling doesn't distinguish おう from おお, romaji
 * output doubles the vowel letter the same way rather than guessing kana
 * spelling, so both scripts stay directly comparable.
 */
const SYLLABLE_TO_ROMAJI: Record<string, string> = {
  아: "a", 이: "i", 우: "u", 에: "e", 오: "o",
  카: "ka", 키: "ki", 쿠: "ku", 케: "ke", 코: "ko",
  캬: "kya", 큐: "kyu", 쿄: "kyo",
  가: "ga", 기: "gi", 구: "gu", 게: "ge", 고: "go",
  갸: "gya", 규: "gyu", 교: "gyo",
  사: "sa", 시: "shi", 스: "su", 세: "se", 소: "so",
  샤: "sha", 슈: "shu", 쇼: "sho",
  자: "za", 지: "ji", 즈: "zu", 제: "ze", 조: "zo",
  쟈: "ja", 쥬: "ju", 죠: "jo",
  타: "ta", 치: "chi", 츠: "tsu", 테: "te", 토: "to",
  쵸: "cho", 츄: "chu",
  다: "da", 데: "de", 도: "do",
  나: "na", 니: "ni", 누: "nu", 네: "ne", 노: "no",
  냐: "nya", 뉴: "nyu", 뇨: "nyo",
  하: "ha", 히: "hi", 후: "fu", 헤: "he", 호: "ho",
  햐: "hya", 휴: "hyu", 효: "hyo",
  바: "ba", 비: "bi", 부: "bu", 베: "be", 보: "bo",
  뱌: "bya", 뷰: "byu", 뵤: "byo",
  파: "pa", 피: "pi", 푸: "pu", 페: "pe", 포: "po",
  퍄: "pya", 퓨: "pyu", 표: "pyo",
  마: "ma", 미: "mi", 무: "mu", 메: "me", 모: "mo",
  먀: "mya", 뮤: "myu", 묘: "myo",
  야: "ya", 유: "yu", 요: "yo",
  라: "ra", 리: "ri", 루: "ru", 레: "re", 로: "ro",
  랴: "rya", 류: "ryu", 료: "ryo",
  와: "wa",
  훼: "fe",
};

// ㄴ/ㅇ batchim: represents ん (nasal), always romanized "n".
const NASAL_JONG = new Set([4, 21]);
// ㅅ batchim: represents っ (sokuon), doubles the next mora's leading letter.
const SOKUON_JONG = new Set([19]);

function decomposeHangul(ch: string): { base: string; jong: number } | null {
  const code = ch.codePointAt(0)!;
  if (code < 0xac00 || code > 0xd7a3) return null;
  const idx = code - HANGUL_BASE;
  const cho = Math.floor(idx / (JUNG_COUNT * JONG_COUNT));
  const jung = Math.floor((idx % (JUNG_COUNT * JONG_COUNT)) / JONG_COUNT);
  const jong = idx % JONG_COUNT;
  const baseCode = HANGUL_BASE + (cho * JUNG_COUNT + jung) * JONG_COUNT;
  return { base: String.fromCodePoint(baseCode), jong };
}

/**
 * Converts this project's Korean phonetic transcription of Japanese
 * (the `reading` field) into Hepburn romaji. Non-Hangul characters
 * (punctuation) pass through unchanged.
 */
export function hangulReadingToRomaji(reading: string): string {
  let result = "";
  let pendingGemination = false;
  let pendingApostrophe = false;

  for (const ch of reading) {
    const decomposed = decomposeHangul(ch);
    if (!decomposed) {
      result += ch;
      pendingGemination = false;
      pendingApostrophe = false;
      continue;
    }

    const { base, jong } = decomposed;
    let mora = SYLLABLE_TO_ROMAJI[base] ?? base;

    if (pendingApostrophe) {
      if (/^[aeiouy]/.test(mora)) result += "'";
      pendingApostrophe = false;
    }
    if (pendingGemination) {
      mora = mora[0] + mora;
      pendingGemination = false;
    }
    result += mora;

    if (NASAL_JONG.has(jong)) {
      result += "n";
      pendingApostrophe = true;
    } else if (SOKUON_JONG.has(jong)) {
      pendingGemination = true;
    }
  }

  return result;
}
