import Link from "next/link";
import { notFound } from "next/navigation";
import { contents, getContentById } from "@/lib/mock-data";
import ReaderScreen from "@/components/ReaderScreen";

export function generateStaticParams() {
  return contents.map((content) => ({ id: content.id }));
}

export default async function ReadPage({
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
      <main className="w-full max-w-3xl px-6 py-10">
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-[#1E2761]"
        >
          ← 목록으로
        </Link>
        <h1 className="mt-3 text-xl font-bold text-slate-900">
          {content.title}
        </h1>
        <p className="mb-6 text-xs text-slate-400">{content.source}</p>

        <ReaderScreen content={content} />
      </main>
    </div>
  );
}
