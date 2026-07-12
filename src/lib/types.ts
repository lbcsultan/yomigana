export interface TokenMeta {
  word: string;
  particle?: string;
  /**
   * Literal leading substring of `surface` covering the word's stem, used only
   * when `word` (the dictionary form) differs from how it's inflected in
   * `surface` — e.g. word "できる" but surface "できます。" (stem "でき").
   */
  root?: string;
  /**
   * Literal leading substring of `reading` covering the word's stem reading,
   * analogous to `root` but for the Korean phonetic transcription.
   */
  readingRoot?: string;
}

export interface Token {
  token_id: number;
  surface: string;
  reading: string;
  definition: string;
  pos: string;
  meta?: TokenMeta;
}

export interface Content {
  id: string;
  title: string;
  source: string;
  full_translation: string;
  tokens: Token[];
}
