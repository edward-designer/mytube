export const cx = (classArray: string[]): string =>
  classArray.filter(Boolean).join(" ");
