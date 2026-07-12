"use client";

import { Content } from "@/lib/types";
import TokenSurface from "./TokenSurface";
import TokenReading from "./TokenReading";

interface SentenceReaderProps {
  content: Content;
}

export default function SentenceReader({ content }: SentenceReaderProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-x-1 gap-y-6 rounded-lg border border-slate-200 bg-white p-6">
        {content.tokens.map((token) => (
          <div
            key={token.token_id}
            className="group flex flex-col items-center gap-1 rounded-md px-2 py-1 text-center transition-colors hover:bg-[#1E2761]/5"
            title={`${token.pos}${token.meta?.particle ? ` · 조사: ${token.meta.particle}` : ""}`}
          >
            <span className="text-2xl leading-tight text-slate-900">
              <TokenSurface token={token} />
            </span>
            <span className="text-sm font-medium leading-tight text-[#1E2761]">
              <TokenReading token={token} />
            </span>
            <span className="text-xs leading-tight text-slate-400 group-hover:text-slate-600">
              {token.definition}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          문장 번역
        </p>
        <p className="mt-1 text-base text-slate-800">
          {content.full_translation}
        </p>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          한글 발음
        </p>
        <p className="mt-1 text-base text-[#1E2761]">
          {content.tokens.map((token) => token.reading).join(" ")}
        </p>
      </div>
    </div>
  );
}
