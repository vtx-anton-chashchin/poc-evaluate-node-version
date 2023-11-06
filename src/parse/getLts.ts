import { Release } from '../getReleases'
import { getMajorPrefix } from './utils'

export const getLts = (releases: Release[]) => {
  const active = new Set<string>()
  const maintenance = new Set<string>()

  const ltsReleases = releases.filter((r) => r.lts !== false)

  let currentPrefix: string | null = null
  let currentSet = active

  for (const r of ltsReleases) {
    const prefix = getMajorPrefix(r.version)

    if (currentPrefix === null) currentPrefix = prefix

    if (currentPrefix !== prefix) {
      if (currentSet === maintenance) break

      if (currentSet === active) {
        currentSet = maintenance
        currentPrefix = prefix
      }
    }

    currentSet.add(r.version)
  }

  return {
    active,
    maintenance,
  }
}
