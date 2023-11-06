import { Release } from '../getReleases'

export const getAll = (releases: Release[]) =>
  new Set(releases.map((r) => r.version))
