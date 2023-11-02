import { Release } from './getReleases'

export type LtsRelease = {
  version: string
  security: boolean
}

export const getLtsReleases = (releases: Release[]): LtsRelease[] =>
  releases
    .filter((r) => r.lts !== false)
    .map((r) => ({ version: r.version, security: r.security }))
