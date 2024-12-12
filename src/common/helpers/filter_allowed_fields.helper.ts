export function filterAllowedFields<T>(
  fields: Partial<T>,
  allowedFields: string[],
): Partial<T> {
  return Object.keys(fields)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = fields[key];
      return obj;
    }, {} as Partial<T>);
}
