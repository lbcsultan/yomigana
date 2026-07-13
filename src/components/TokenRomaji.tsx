import { Token } from "@/lib/types";
import { splitRomajiStem } from "@/lib/text";

interface TokenRomajiProps {
  token: Token;
}

export default function TokenRomaji({ token }: TokenRomajiProps) {
  const { stem, rest } = splitRomajiStem(token);
  return (
    <>
      <strong className="font-bold">{stem}</strong>
      {rest}
    </>
  );
}
