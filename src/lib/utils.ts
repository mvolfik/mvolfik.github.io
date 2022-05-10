export function intersperse<T, U>(array: Array<T>, sep: U): Array<T | U> {
  return array.reduce((prev, next) => [
    ...(Array.isArray(prev) ? prev : [prev]),
    sep,
    next,
  ]);
}
