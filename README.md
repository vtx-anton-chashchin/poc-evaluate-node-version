# UIEN-4386

Investigate how to ensure that proper node.js version is enforced.
Reference:
https://nodejs.dev/en/about/releases/

## Acceptance Criteria

- Determine what version of node MFEs must be on at any given time. Provide reasoning for which node versions to "warn on" and which versions to "error on".
- Find a way to access node version data programmatically (like via an API that gets the up-to-date source of truth) to be used in the implementation ticket (UIEN-4387).
- if we learn in this ticket that it's hard to say up to date, then we should bump up or repoint UIEN-4387

In short:

1. find source-of-truth for node.js releases
2. provide a strategy for classifying node.js versions
3. classify node.js version into 3 groups, like "ok", "warn", "error"

## Solution

### 1.Source-of-truth

https://nodejs.org/dist/index.json

Contains all node.js releases of all the time, it contains sorted (DESC by version) array of items with the following structure

```tsx
type Release = {
  version: string // version of node.js
  date: string
  files: string[]
  npm: string //version of npm
  v8: string
  uv: string
  zlib: string
  openssl: string
  modules: string
  lts: string | false // is this LTS (and which group) or not
  security: false // does it contain security updates
}
```

### 2. Strategy of classifying node.js versions

Key points:

- Vendor recommendations
- Maintenance
- Security

#### Vendor recommendations

Based on node.js vendor recommendations (https://nodejs.org/en/about/previous-releases#)
we need to use only LTS versions with odd major versions

#### Maintenance

Each LTS versions has at least 30 months life time and node.js releases approximately every 6 months,
so that means we can guarantee to use 2 last LTS major versions

#### Security

Each release has flag which says does it contain security fixes or not

It means all previous versions of this major unsecure and all vulnerabilities are known by the changelog of this version

So that means inside the LTS major group we can safely use the range of versions starting from the latest security release up to the latest in this major group

Example:

1. Have an array of all node.js releases

```json
[
  { "version": "21.0.3", "lts": false, "security": false },
  { "version": "21.0.2", "lts": false, "security": false },
  { "version": "21.0.1", "lts": false, "security": false },
  { "version": "21.0.0", "lts": false, "security": false },

  { "version": "20.0.3", "lts": "Iron", "security": false },
  { "version": "20.0.2", "lts": "Iron", "security": false },
  { "version": "20.0.1", "lts": "Iron", "security": true },
  { "version": "20.0.0", "lts": false, "security": true },

  { "version": "19.0.3", "lts": false, "security": false },
  { "version": "19.0.2", "lts": false, "security": false },
  { "version": "19.0.1", "lts": false, "security": false },
  { "version": "19.0.0", "lts": false, "security": false },

  { "version": "18.0.3", "lts": "Hydrogen", "security": false },
  { "version": "18.0.2", "lts": "Hydrogen", "security": true },
  { "version": "18.0.1", "lts": "Hydrogen", "security": false },
  { "version": "18.0.0", "lts": false, "security": true },

  { "version": "17.0.3", "lts": false, "security": false },
  { "version": "17.0.2", "lts": false, "security": false },
  { "version": "17.0.1", "lts": false, "security": false },
  { "version": "17.0.0", "lts": false, "security": false },

  { "version": "16.0.3", "lts": "Oxygen", "security": false },
  { "version": "16.0.2", "lts": "Oxygen", "security": true },
  { "version": "16.0.1", "lts": "Oxygen", "security": false },
  { "version": "16.0.0", "lts": false, "security": true }
]
```

2. Skip all non-LTS release

```json
[
  { "version": "20.0.3", "lts": "Iron", "security": false },
  { "version": "20.0.2", "lts": "Iron", "security": false },
  { "version": "20.0.1", "lts": "Iron", "security": true },

  { "version": "18.0.3", "lts": "Hydrogen", "security": false },
  { "version": "18.0.2", "lts": "Hydrogen", "security": true },
  { "version": "18.0.1", "lts": "Hydrogen", "security": false },

  { "version": "16.0.3", "lts": "Oxygen", "security": false },
  { "version": "16.0.2", "lts": "Oxygen", "security": true },
  { "version": "16.0.1", "lts": "Oxygen", "security": false }
]
```

3. Keep only 2 last major versions (which are maintained according the node.js release cycle)

```json
[
  { "version": "20.0.3", "lts": "Iron", "security": false },
  { "version": "20.0.2", "lts": "Iron", "security": false },
  { "version": "20.0.1", "lts": "Iron", "security": true },

  { "version": "18.0.3", "lts": "Hydrogen", "security": false },
  { "version": "18.0.2", "lts": "Hydrogen", "security": true },
  { "version": "18.0.1", "lts": "Hydrogen", "security": false }
]
```

3. Keep only releases after last security update (including it)

```json
[
  { "version": "20.0.3", "lts": "Iron", "security": false },
  { "version": "20.0.2", "lts": "Iron", "security": false },
  { "version": "20.0.1", "lts": "Iron", "security": true },

  { "version": "18.0.3", "lts": "Hydrogen", "security": false },
  { "version": "18.0.2", "lts": "Hydrogen", "security": true }
]
```

4. Extract required (min and max version of each group) and recommended (latest possible version of all groups) ranges:

```ts
{
  required: [
    { from: '20.0.1', to: '20.0.3' },
    { from: '18.0.2', to: '18.0.3' },
  ],
  recommended: '20.0.3',
}
```

### 3. Classify node.js version into 3 groups, like "ok", "warn", "error"

- out of required ranges - "error"
- in required ranges but not equal recommended - "warn"
- equal to recommended - "ok"
