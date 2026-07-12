import { Token } from "@/lib/types";
import { splitStem } from "@/lib/text";

interface TokenSurfaceProps {
  token: Token;
}

export default function TokenSurface({ token }: TokenSurfaceProps) {
  const { stem, rest } = splitStem(token);
  return (
    <>
      <strong className="font-bold">{stem}</strong>
      {rest}
    </>
  );
}
