const sort = <T>(a: Set<T>, b: Set<T>) => {
  if (a.size <= b.size) return [a, b] as const
  return [b, a] as const
}

export const getIntersection = <T>(a: Set<T>, b: Set<T>) => {
  const [shortest, longest] = sort(a, b)

  const result = new Set<T>()

  shortest.forEach((v) => {
    if (longest.has(v)) result.add(v)
  })

  return result
}

export const getUnion = <T>(a: Set<T>, b: Set<T>): Set<T> =>
  new Set([...a, ...b])
