export function intersperse<T, U>(array: Array<T>, sep: U): Array<T | U> {
  return array.reduce(
    (prev, next) => (prev.length ? [...prev, sep, next] : [next]),
    [] as Array<T | U>,
  );
}
