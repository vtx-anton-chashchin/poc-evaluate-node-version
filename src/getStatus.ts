import { Range } from './types'
import { Version, inRange, isEqual } from './version'

export const getStatus = (args: {
  version: Version
  current: Range<Version>
  previous: Range<Version>
}) => {
  if (
    !inRange(args.version, args.current) &&
    !inRange(args.version, args.previous)
  )
    return 'error'

  if (!isEqual(args.version, args.current.to)) return 'warning'

  return 'ok'
}
