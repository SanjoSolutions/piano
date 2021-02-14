export function reverseMap(map) {
  return new Map(Array.from(map.entries()).map(([key, value]) => [value, key]))
}
