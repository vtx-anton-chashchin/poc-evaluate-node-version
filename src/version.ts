import { Range } from './types'

export type Version = {
  major: number
  minor: number
  patch: number
}

export const parse = (version: string): Version => {
  const [major, minor, patch] = version
    .slice(1)
    .split('.')
    .map((v) => parseInt(v))

  return {
    major,
    minor,
    patch,
  }
}

export const stringify = (version: Version) =>
  `v${version.major}.${version.minor}.${version.patch}`

const compare = (a: Version, b: Version) => {
  const majorDiff = a.major - b.major
  if (majorDiff !== 0) return majorDiff

  const minorDiff = a.minor - b.minor
  if (minorDiff !== 0) return minorDiff

  return a.patch - b.patch
}
export const isMore = (a: Version, b: Version) => compare(a, b) > 0

export const isLess = (a: Version, b: Version) => compare(a, b) < 0

export const isEqual = (a: Version, b: Version) => compare(a, b) === 0

export const inRange = (value: Version, range: Range<Version>) => {
  if (isMore(value, range.to)) return false
  if (isLess(value, range.from)) return false
  return true
}
