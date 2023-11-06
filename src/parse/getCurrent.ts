import { Release } from '../getReleases'
import { getMajorPrefix } from './utils'

export const getCurrent = (releases: Release[]) => {
  let prefix: string | null = null

  const result = new Set<string>()

  for (const r of releases) {
    if (prefix === null) prefix = getMajorPrefix(r.version)

    if (r.version.startsWith(prefix)) {
      result.add(r.version)
    } else {
      break
    }
  }

  return result
}
