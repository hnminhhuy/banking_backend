export function throwError(errorMessage = ''): never {
  throw new Error(errorMessage);
}
