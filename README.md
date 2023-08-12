# Image Utils

## Package Manager `pnpm`

Enable `pnpm` using Node.js's `corepack`:

```sh
corepack enable
```

```sh
corepack prepare pnpm@latest --activate
```

## Install packages

```sh
pnpm install --no-frozen-lockfile
```

## How to use

You need to first build the lib.

- `pnpm run build`
- `pnpm run start`

## Update `nx` packages

- `pnpm exec nx migrate nx@latest`

## Changelog

To update the version and generate the associated changelog, use the following command:

- `pnpm exec changelogen --release --no-tag -r x.x.x`

## Commit Convention

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: any
  │
  │
  │
  │
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|release|revert|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (examples: CircleCi, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **release**: A release point in the repository
- **revert**: Reverting a change
- **test**: Adding missing tests or correcting existing tests

## Other

### Bundle

- Build for `esm` & `cjs`
  - https://antfu.me/posts/publish-esm-and-cjs
- `@nx/esbuild:esbuild`
  - Does not support type declaration generation yet
    - Sort of WIP: https://github.com/nrwl/nx/pull/18213

### ESLint

- `@nx/dependency-checks`
  - There are some packages that we want to ignore because they are used internally or are necessary for compilation
  - https://dev.to/this-is-learning/manage-nx-library-dependencies-with-the-nxdependency-checks-eslint-rule-2lem
- `@typescript-eslint/*` `6`
  - Not yet supported on `nx`
- `eslint-plugin-unused-imports` `^3.0.0`
  - Only compatible with `@typescript-eslint/*` `^6.0.0`

### Commitlint

- There's a problem with `"type": "module"`, we need to set the extension as `.cts`
  - https://github.com/conventional-changelog/commitlint/issues/3251
  - https://github.com/conventional-changelog/commitlint/pull/3461

### Prettier

- Version `^3.0.0` is not yet supported on `nx`
  - https://github.com/nrwl/nx/pull/18644
