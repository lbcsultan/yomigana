"use client";

import { useRef, useState } from "react";
import { Content } from "@/lib/types";
import { normalizeReading, normalizeRomaji, getTokenRomaji } from "@/lib/text";
import TokenSurface from "./TokenSurface";

interface DictationModeProps {
  content: Content;
}

type Grade = "unanswered" | "correct" | "incorrect";

interface TokenAnswer {
  hangul: string;
  romaji: string;
}

interface TokenGrade {
  hangul: Grade;
  romaji: Grade;
}

const EMPTY_ANSWER: TokenAnswer = { hangul: "", romaji: "" };

export default function DictationMode({ content }: DictationModeProps) {
  const [answers, setAnswers] = useState<Record<number, TokenAnswer>>({});
  const [grades, setGrades] = useState<Record<number, TokenGrade>>({});
  const [graded, setGraded] = useState(false);
  const hangulRefs = useRef<(HTMLInputElement | null)[]>([]);
  const romajiRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "hangul" | "romaji",
    index: number
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const refs = field === "hangul" ? hangulRefs : romajiRefs;
    refs.current[index + 1]?.focus();
  };

  const handleChange = (
    tokenId: number,
    field: "hangul" | "romaji",
    value: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [tokenId]: { ...(prev[tokenId] ?? EMPTY_ANSWER), [field]: value },
    }));
    if (graded) setGraded(false);
  };

  const gradeAll = () => {
    const nextGrades: Record<number, TokenGrade> = {};
    for (const token of content.tokens) {
      const answer = answers[token.token_id] ?? EMPTY_ANSWER;

      const hangulAnswer = normalizeReading(answer.hangul);
      const hangulGrade: Grade = !hangulAnswer
        ? "unanswered"
        : hangulAnswer === normalizeReading(token.reading)
        ? "correct"
        : "incorrect";

      const romajiAnswer = normalizeRomaji(answer.romaji);
      const romajiGrade: Grade = !romajiAnswer
        ? "unanswered"
        : romajiAnswer === normalizeRomaji(getTokenRomaji(token))
        ? "correct"
        : "incorrect";

      nextGrades[token.token_id] = { hangul: hangulGrade, romaji: romajiGrade };
    }
    setGrades(nextGrades);
    setGraded(true);
  };

  const reset = () => {
    setAnswers({});
    setGrades({});
    setGraded(false);
  };

  const correctCount = Object.values(grades).reduce(
    (sum, g) =>
      sum + (g.hangul === "correct" ? 1 : 0) + (g.romaji === "correct" ? 1 : 0),
    0
  );
  const totalCount = content.tokens.length * 2;

  const inputClass = (grade: Grade | undefined) => {
    if (!graded || !grade) return "border-slate-300 focus:border-[#1E2761]";
    if (grade === "correct") return "border-emerald-500 bg-emerald-50";
    if (grade === "incorrect") return "border-red-400 bg-red-50";
    return "border-slate-300";
  };

  const surfaceClass = (tokenId: number) => {
    if (!graded) return "text-slate-900";
    const grade = grades[tokenId];
    if (!grade) return "text-slate-900";
    if (grade.hangul === "correct" && grade.romaji === "correct")
      return "text-blue-600";
    if (grade.hangul === "incorrect" || grade.romaji === "incorrect")
      return "text-red-600";
    return "text-slate-900";
  };

  return (
    <div>
      <p className="mb-3 text-xs text-slate-400">
        입력창에서 Enter를 누르면 같은 방식(한글/romaji)의 다음 단어 입력창으로 이동합니다.
      </p>

      <div className="flex flex-wrap gap-x-1 gap-y-6 rounded-lg border border-slate-200 bg-white p-6">
        {content.tokens.map((token, i) => {
          const answer = answers[token.token_id] ?? EMPTY_ANSWER;
          const grade = grades[token.token_id];
          return (
            <div
              key={token.token_id}
              className="flex flex-col items-center gap-1 px-2 py-1 text-center"
            >
              <span
                title={`${token.reading} / ${getTokenRomaji(token)}`}
                className={`text-2xl leading-tight transition-colors cursor-help ${surfaceClass(
                  token.token_id
                )}`}
              >
                <TokenSurface token={token} />
              </span>
              <input
                ref={(el) => {
                  hangulRefs.current[i] = el;
                }}
                value={answer.hangul}
                onChange={(e) =>
                  handleChange(token.token_id, "hangul", e.target.value)
                }
                onKeyDown={(e) => handleEnter(e, "hangul", i)}
                placeholder="한글 발음"
                className={`w-24 rounded border px-1 py-0.5 text-center text-sm outline-none ${inputClass(
                  grade?.hangul
                )}`}
              />
              <input
                ref={(el) => {
                  romajiRefs.current[i] = el;
                }}
                value={answer.romaji}
                onChange={(e) =>
                  handleChange(token.token_id, "romaji", e.target.value)
                }
                onKeyDown={(e) => handleEnter(e, "romaji", i)}
                placeholder="romaji"
                className={`w-24 rounded border px-1 py-0.5 text-center text-sm italic outline-none ${inputClass(
                  grade?.romaji
                )}`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={gradeAll}
          className="rounded-md bg-[#1E2761] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E2761]/90"
        >
          채점하기
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          다시 풀기
        </button>
        {graded && (
          <span className="text-sm font-medium text-slate-600">
            {correctCount} / {totalCount} 정답
          </span>
        )}
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          문장 번역
        </p>
        <p className="mt-1 text-base text-slate-800">
          {content.full_translation}
        </p>
      </div>
    </div>
  );
}
