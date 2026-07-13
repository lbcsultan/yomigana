"use client";

import { useEffect, useRef, useState } from "react";
import { Content } from "@/lib/types";
import { normalizeReading, normalizeRomaji, getTokenRomaji } from "@/lib/text";
import TokenSurface from "./TokenSurface";
import TokenReading from "./TokenReading";
import TokenRomaji from "./TokenRomaji";

interface ComposeModeProps {
  content: Content;
}

export default function ComposeMode({ content }: ComposeModeProps) {
  const [index, setIndex] = useState(0);
  const [hangulValue, setHangulValue] = useState("");
  const [romajiValue, setRomajiValue] = useState("");
  const [isHangulWrong, setIsHangulWrong] = useState(false);
  const [isRomajiWrong, setIsRomajiWrong] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const hangulInputRef = useRef<HTMLInputElement>(null);

  const finished = index >= content.tokens.length;
  const currentToken = finished ? null : content.tokens[index];

  useEffect(() => {
    hangulInputRef.current?.focus();
  }, [index]);

  const composedTokens = content.tokens.slice(0, index);
  const remainingCount = content.tokens.length - index;
  const remainingPlaceholder = Array(remainingCount).fill("▢").join(" ");

  const advance = () => {
    setIndex((i) => i + 1);
    setHangulValue("");
    setRomajiValue("");
    setIsHangulWrong(false);
    setIsRomajiWrong(false);
    setIsRevealed(false);
  };

  const submitHangul = () => {
    if (!currentToken) return;
    const answer = normalizeReading(hangulValue);
    if (!answer) return;

    if (answer === normalizeReading(currentToken.reading)) {
      advance();
    } else {
      setIsHangulWrong(true);
    }
  };

  const submitRomaji = () => {
    if (!currentToken) return;
    const answer = normalizeRomaji(romajiValue);
    if (!answer) return;

    if (answer === normalizeRomaji(getTokenRomaji(currentToken))) {
      advance();
    } else {
      setIsRomajiWrong(true);
    }
  };

  const handleHangulKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitHangul();
    }
  };

  const handleRomajiKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitRomaji();
    }
  };

  const reveal = () => {
    if (!currentToken) return;
    setIsRevealed(true);
  };

  const reset = () => {
    setIndex(0);
    setHangulValue("");
    setRomajiValue("");
    setIsHangulWrong(false);
    setIsRomajiWrong(false);
    setIsRevealed(false);
  };

  return (
    <div>
      <div className="rounded-lg bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          목표 문장 (한국어)
        </p>
        <p className="mt-1 text-base text-slate-800">
          {content.full_translation}
        </p>
      </div>

      <div className="mt-4 min-h-20 rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          입력 중인 일본어 문장
        </p>
        <p className="mt-2 text-3xl leading-relaxed tracking-wide">
          <span className="text-slate-900">
            {composedTokens.map((token, i) => (
              <span key={token.token_id}>
                {i > 0 && " "}
                <TokenSurface token={token} />
              </span>
            ))}
          </span>
          {!finished && (
            <span className="text-slate-300">
              {composedTokens.length > 0 ? " " : ""}
              {remainingPlaceholder}
            </span>
          )}
        </p>
      </div>

      {finished ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-medium text-emerald-700">
            문장을 완성했습니다!
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 rounded-md bg-[#1E2761] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E2761]/90"
          >
            다시 입력하기
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-slate-500">
            다음 단어의 뜻:{" "}
            <span className="font-medium text-slate-800">
              {currentToken?.definition}
            </span>
          </p>

          <div className="mt-2 flex items-center gap-2">
            <input
              ref={hangulInputRef}
              value={hangulValue}
              onChange={(e) => {
                setHangulValue(e.target.value);
                setIsHangulWrong(false);
              }}
              onKeyDown={handleHangulKeyDown}
              placeholder="한글 발음으로 입력"
              className={`w-48 rounded border px-3 py-2 text-base outline-none ${
                isHangulWrong
                  ? "border-red-400 bg-red-50"
                  : "border-slate-300 focus:border-[#1E2761]"
              }`}
            />
            <button
              type="button"
              onClick={submitHangul}
              className="rounded-md bg-[#1E2761] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E2761]/90"
            >
              입력
            </button>
          </div>
          {isHangulWrong && (
            <p className="mt-1 text-xs text-red-500">
              발음이 일치하지 않아요. 다시 시도해보세요.
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <input
              value={romajiValue}
              onChange={(e) => {
                setRomajiValue(e.target.value);
                setIsRomajiWrong(false);
              }}
              onKeyDown={handleRomajiKeyDown}
              placeholder="romaji로 입력"
              className={`w-48 rounded border px-3 py-2 text-base italic outline-none ${
                isRomajiWrong
                  ? "border-red-400 bg-red-50"
                  : "border-slate-300 focus:border-[#1E2761]"
              }`}
            />
            <button
              type="button"
              onClick={submitRomaji}
              className="rounded-md bg-[#1E2761] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E2761]/90"
            >
              입력
            </button>
          </div>
          {isRomajiWrong && (
            <p className="mt-1 text-xs text-red-500">
              발음이 일치하지 않아요. 다시 시도해보세요.
            </p>
          )}

          <div className="mt-2">
            <button
              type="button"
              onClick={reveal}
              className="text-xs text-slate-400 underline hover:text-slate-600"
            >
              발음 힌트
            </button>
          </div>
          {isRevealed && currentToken && (
            <p className="mt-1 text-xs text-slate-400">
              힌트: <TokenReading token={currentToken} /> /{" "}
              <TokenRomaji token={currentToken} />
            </p>
          )}
          <p className="mt-3 text-xs text-slate-400">
            {index + 1} / {content.tokens.length}
          </p>
        </div>
      )}
    </div>
  );
}
