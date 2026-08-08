const SHORT_RUSSIAN_WORDS = [
  "из-за",
  "из-под",
  "без",
  "для",
  "или",
  "над",
  "обо",
  "под",
  "при",
  "про",
  "во",
  "до",
  "за",
  "из",
  "ко",
  "на",
  "не",
  "ни",
  "но",
  "об",
  "от",
  "по",
  "со",
  "а",
  "в",
  "и",
  "к",
  "о",
  "с",
  "у",
].join("|");

const WORD_BOUNDARY = String.raw`(^|[\s([{"'«„])`;
const NEXT_WORD = String.raw`(?=[\p{L}\p{N}])`;

const SHORT_WORD_WITH_SPACE = new RegExp(
  `${WORD_BOUNDARY}(${SHORT_RUSSIAN_WORDS})[ \t\r\n]+${NEXT_WORD}`,
  "giu",
);

const TRAILING_SHORT_WORD = new RegExp(
  `${WORD_BOUNDARY}(${SHORT_RUSSIAN_WORDS})[ \t\r\n]+$`,
  "iu",
);

/** Связывает короткий русский предлог/союз со следующим словом. */
export function preventHangingPrepositions(value: string) {
  return value.replace(
    SHORT_WORD_WITH_SPACE,
    (_match, prefix: string, word: string) => `${prefix}${word}\u00a0`,
  );
}

/** Находит короткий предлог в конце текстового узла перед inline-разметкой. */
export function hasTrailingShortWord(value: string) {
  return TRAILING_SHORT_WORD.test(value);
}

/** Заменяет финальный обычный пробел после короткого предлога на неразрывный. */
export function protectTrailingShortWord(value: string) {
  return value.replace(
    TRAILING_SHORT_WORD,
    (_match, prefix: string, word: string) => `${prefix}${word}\u00a0`,
  );
}
