import Link from "next/link";
import { contents } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-slate-50">
      <main className="w-full max-w-3xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm font-semibold text-[#1E2761]">
            요미가나 Yomigana
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            한글 발음 기반 일본어 학습
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            원문 · 발음 · 번역을 3단으로 정렬해 보여주는 리더 프로토타입입니다.
            아래 콘텐츠를 선택해 읽거나 받아쓰기 연습을 해보세요.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-3">
          {contents.map((content) => (
            <li key={content.id}>
              <Link
                href={`/read/${content.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-[#1E2761]/40 hover:bg-[#1E2761]/5"
              >
                <p className="font-medium text-slate-900">{content.title}</p>
                <p className="mt-1 text-xs text-slate-400">{content.source}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
