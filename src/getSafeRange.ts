import { LtsRelease } from './getLtsReleases'
import { Range } from './types'
import { Version, parse } from './version'

export const getSafeRange = (releases: LtsRelease[]): Range<Version> => {
  const latest = releases.at(0)
  if (!latest) throw new Error('Latest release not found')

  const earliest = releases.find((r) => r.security) ?? releases.at(-1)
  if (!earliest) throw new Error('Earliest release not found')

  return {
    from: parse(earliest.version),
    to: parse(latest.version),
  }
}
