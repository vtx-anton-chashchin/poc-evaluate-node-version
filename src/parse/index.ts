import { Release } from '../getReleases'
import { getAll } from './getAll'
import { getCurrent } from './getCurrent'
import { getLts } from './getLts'
import { getSecure } from './getSecure'

export const parse = (releases: Release[]) => {
  const all = getAll(releases)
  const current = getCurrent(releases)
  const secure = getSecure(releases)
  const lts = getLts(releases)

  return {
    all,
    current,
    secure,
    lts,
  }
}

export type ParsedReleases = ReturnType<typeof parse>
