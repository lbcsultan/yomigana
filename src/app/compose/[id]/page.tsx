import { notFound } from "next/navigation";
import { contents, getContentById } from "@/lib/mock-data";
import ComposeMode from "@/components/ComposeMode";

export function generateStaticParams() {
  return contents.map((content) => ({ id: content.id }));
}

export default async function ComposePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = getContentById(id);

  if (!content) {
    notFound();
  }

  return (
    <div className="flex flex-1 justify-center bg-slate-50">
      <main className="w-full max-w-xl px-6 py-10">
        <p className="text-sm font-semibold text-[#1E2761]">
          요미가나 · 입력 연습
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">
          {content.title}
        </h1>
        <p className="mb-6 text-xs text-slate-400">{content.source}</p>

        <ComposeMode content={content} />
      </main>
    </div>
  );
}
