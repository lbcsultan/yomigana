import { Token } from "@/lib/types";
import { splitReadingStem } from "@/lib/text";

interface TokenReadingProps {
  token: Token;
}

export default function TokenReading({ token }: TokenReadingProps) {
  const { stem, rest } = splitReadingStem(token);
  return (
    <>
      <strong className="font-bold">{stem}</strong>
      {rest}
    </>
  );
}
