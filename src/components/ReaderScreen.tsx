"use client";

import { useState } from "react";
import { Content } from "@/lib/types";
import SentenceReader from "./SentenceReader";
import DictationMode from "./DictationMode";

interface ReaderScreenProps {
  content: Content;
}

type Mode = "read" | "dictation";

export default function ReaderScreen({ content }: ReaderScreenProps) {
  const [mode, setMode] = useState<Mode>("read");

  return (
    <div>
      <div className="mb-5 inline-flex rounded-lg border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("read")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "read"
              ? "bg-[#1E2761] text-white"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          읽기 모드
        </button>
        <button
          type="button"
          onClick={() => setMode("dictation")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "dictation"
              ? "bg-[#1E2761] text-white"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          받아쓰기 모드
        </button>
      </div>

      <button
        type="button"
        onClick={() =>
          window.open(
            `/compose/${content.id}`,
            "yomigana-compose",
            "width=560,height=720"
          )
        }
        className="mb-5 ml-2 rounded-lg border border-[#1E2761]/30 px-3 py-1.5 text-sm font-medium text-[#1E2761] hover:bg-[#1E2761]/5"
      >
        새 창에서 입력 연습 ↗
      </button>

      {mode === "read" ? (
        <SentenceReader content={content} />
      ) : (
        <DictationMode content={content} />
      )}
    </div>
  );
}
