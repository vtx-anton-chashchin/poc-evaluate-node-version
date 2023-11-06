import { getReleases } from './getReleases'
import { parse } from './parse'
import { score } from './score'

export const main = async (version: string) => {
  const releases = await getReleases()

  const classifiedReleases = parse(releases)

  return score(classifiedReleases, version)
}

main(process.argv[2]).then(console.log)
