export const getMajorPrefix = (v: string) => {
  const [major] = v.split('.')
  return `${major}.`
}
