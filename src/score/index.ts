import { ParsedReleases } from '../parse'
import { getIntersection, getUnion } from './utils'

export const score = (releases: ParsedReleases, version: string) => {
  const required = getUnion(releases.lts.active, releases.lts.maintenance)

  const recommended = getIntersection(required, releases.secure)

  const base = {
    version,
    required: [...required],
    recommended: [...recommended],
  }

  if (!required.has(version))
    return {
      ...base,
      status: 'ERROR' as const,
    }

  if (!recommended.has(version))
    return {
      ...base,
      status: 'WARN' as const,
    }

  return {
    ...base,
    status: 'OK' as const,
  }
}
