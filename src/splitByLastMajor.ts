import { LtsRelease } from './getLtsReleases'

type Result = {
  last: LtsRelease[]
  other: LtsRelease[]
}

export const splitByLastMajor = (releases: LtsRelease[]) => {
  const latestRelease = releases[0]

  const [major] = latestRelease.version.split('.')

  const prefix = `${major}.`

  return releases.reduce<Result>(
    (result, r) =>
      r.version.startsWith(prefix)
        ? { ...result, last: [...result.last, r] }
        : { ...result, other: [...result.other, r] },
    { last: [], other: [] }
  )
}
