export const parseBoolean = (
  val: string | boolean | number | undefined,
  strict = true,
): boolean | undefined | null => {
  if ((val === undefined || val === null) && !strict) {
    return undefined;
  }
  const s = val && val.toString().toLowerCase().trim();
  return s == 'true' || s == '1';
};
