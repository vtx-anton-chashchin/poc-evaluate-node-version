export type Range<T> = {
  from: T
  to: T
}

type Criteria = {
  required: Range<string>[]
  recommended: string
}

export type Result = {
  status: 'error' | 'warning' | 'ok'
  criteria: Criteria
}
