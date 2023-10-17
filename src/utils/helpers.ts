export const cx = (classArray: string[]): string =>
  classArray.filter(Boolean).join(" ");

export const assertString: (value: unknown) => asserts value is string = (
  value,
) => {
  if (typeof value !== "string") throw new Error("Not a string");
};

export const checkFileSize = (file: File): boolean => {
  return file.size < 104857600;
};

export const checkFileFormat = (file: File): boolean => {
  return /\.{1}(mp4|mov|avi)$/i.test(file.name);
};
