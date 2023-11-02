import { getLtsReleases } from './getLtsReleases'
import { getReleases } from './getReleases'
import { getSafeRange } from './getSafeRange'
import { getStatus } from './getStatus'
import { splitByLastMajor } from './splitByLastMajor'
import { Result } from './types'
import { parse, stringify } from './version'

export const main = async (rawVersion: string): Promise<Result> => {
  const releases = await getReleases()

  const lts = getLtsReleases(releases)

  const { last: currentLts, other } = splitByLastMajor(lts)
  const { last: previousLts } = splitByLastMajor(other)

  const current = getSafeRange(currentLts)
  const previous = getSafeRange(previousLts)

  const version = parse(rawVersion)

  const criteria = {
    recommended: stringify(current.to),
    required: [
      {
        from: stringify(current.from),
        to: stringify(current.to),
      },
      {
        from: stringify(previous.from),
        to: stringify(previous.to),
      },
    ],
  }

  return {
    status: getStatus({ version, current, previous }),
    criteria,
  }
}

main('v20.9.0').then((r) => console.log(JSON.stringify(r, null, 2)))
