export type Release = {
  security: boolean
  version: string
  lts: string | false
}

export const getReleases = async () => {
  try {
    const response = await fetch('https://nodejs.org/dist/index.json')
    const releases = (await response.json()) as Release[]
    return releases
  } catch (e) {
    throw new Error('Unable to load Node.js releases')
  }
}
