import { Release } from '../getReleases'
import { getMajorPrefix } from './utils'

export const getSecure = (releases: Release[]) => {
  const result = new Set<string>()

  let currentPrefix: string | null = null
  let isSecure = false

  for (const r of releases) {
    const prefix = getMajorPrefix(r.version)

    if (currentPrefix !== prefix) {
      currentPrefix = prefix
      isSecure = true
    }

    if (isSecure) result.add(r.version)

    if (r.security) isSecure = false
  }

  return result
}
