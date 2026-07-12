"use client";

import { useState } from "react";
import { Content } from "@/lib/types";
import { normalizeReading } from "@/lib/text";
import TokenSurface from "./TokenSurface";

interface DictationModeProps {
  content: Content;
}

type Grade = "unanswered" | "correct" | "incorrect";

export default function DictationMode({ content }: DictationModeProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [grades, setGrades] = useState<Record<number, Grade>>({});
  const [graded, setGraded] = useState(false);

  const handleChange = (tokenId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [tokenId]: value }));
    if (graded) setGraded(false);
  };

  const gradeAll = () => {
    const nextGrades: Record<number, Grade> = {};
    for (const token of content.tokens) {
      const answer = normalizeReading(answers[token.token_id] ?? "");
      if (!answer) {
        nextGrades[token.token_id] = "unanswered";
      } else if (answer === normalizeReading(token.reading)) {
        nextGrades[token.token_id] = "correct";
      } else {
        nextGrades[token.token_id] = "incorrect";
      }
    }
    setGrades(nextGrades);
    setGraded(true);
  };

  const reset = () => {
    setAnswers({});
    setGrades({});
    setGraded(false);
  };

  const correctCount = Object.values(grades).filter((g) => g === "correct").length;

  const borderClass = (tokenId: number) => {
    if (!graded) return "border-slate-300 focus:border-[#1E2761]";
    const grade = grades[tokenId];
    if (grade === "correct") return "border-emerald-500 bg-emerald-50";
    if (grade === "incorrect") return "border-red-400 bg-red-50";
    return "border-slate-300";
  };

  const surfaceClass = (tokenId: number) => {
    if (!graded) return "text-slate-900";
    const grade = grades[tokenId];
    if (grade === "correct") return "text-blue-600";
    if (grade === "incorrect") return "text-red-600";
    return "text-slate-900";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-x-1 gap-y-6 rounded-lg border border-slate-200 bg-white p-6">
        {content.tokens.map((token) => (
          <div
            key={token.token_id}
            className="flex flex-col items-center gap-1 px-2 py-1 text-center"
          >
            <span
              title={token.reading}
              className={`text-2xl leading-tight transition-colors cursor-help ${surfaceClass(
                token.token_id
              )}`}
            >
              <TokenSurface token={token} />
            </span>
            <input
              value={answers[token.token_id] ?? ""}
              onChange={(e) => handleChange(token.token_id, e.target.value)}
              placeholder="발음 입력"
              className={`w-24 rounded border px-1 py-0.5 text-center text-sm outline-none ${borderClass(
                token.token_id
              )}`}
            />
          </div>
        ))}
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
            {correctCount} / {content.tokens.length} 정답
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
