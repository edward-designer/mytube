export const cx = (classArray: string[]): string =>
  classArray.filter(Boolean).join(" ");

export const assertString: (value: unknown) => asserts value is string = (
  value,
) => {
  if (typeof value !== "string") throw new Error("Not a string");
};
