# Releasing `tabbied`

Releases of the [`tabbied`](./packages/tabbied) npm package are automated with
[Changesets](https://github.com/changesets/changesets) and GitHub Actions.
Publishing uses npm **Trusted Publishing (OIDC)** — there is no `NPM_TOKEN`
secret to manage, and every release gets a
[provenance attestation](https://docs.npmjs.com/generating-provenance-statements)
automatically.

## The day-to-day flow

1. **Make your change** in a normal PR.
2. **Add a changeset** describing it:
   ```bash
   npm run changeset
   ```
   Choose the bump (`patch` / `minor` / `major`) and write a short, user-facing
   summary. Commit the generated `.changeset/*.md` file with your PR.
3. **Merge the PR to `main`.** The [Release workflow](.github/workflows/release.yml)
   sees the pending changeset and opens (or updates) a **"Version Packages"** PR
   that bumps the version, updates `packages/tabbied/CHANGELOG.md`, and removes
   the consumed changeset files.
4. **Either merge the "Version Packages" PR** to ship immediately, **or do
   nothing** — the weekly release below picks it up. Merging it triggers the
   workflow again, which **publishes to npm**, creates the git tag, and cuts a
   GitHub Release with the changelog.

So step 4 is a fast path, not a gate: shipping happens on its own, and merging
the version PR only makes it happen sooner.

## The weekly release

Every **Monday at 17:23 UTC** the same workflow runs on a schedule and releases
`main` by itself. It never opens a version PR — it versions, commits to `main`,
and publishes in one run. What it does depends on what it finds:

| State of `main`                                          | What happens                                       |
| -------------------------------------------------------- | -------------------------------------------------- |
| Changesets are pending                                    | Version + publish (the same bump the version PR would have made) |
| `package.json` is ahead of npm                            | Publish only (recovers a version commit whose publish failed) |
| `packages/tabbied` changed since the last release tag     | Writes a **patch** changeset, then versions + publishes |
| None of the above                                         | Nothing — the run exits quietly                    |

That third row is why a release doesn't depend on anyone remembering to write a
changeset: any package change ships as a patch within the week. Write a
changeset when the change deserves more than a patch, or deserves a changelog
entry in your own words — a hand-written changeset always wins over the
generated one.

Changes outside `packages/tabbied` (the site, docs, CI, the template) don't
release anything, which is what you want — they aren't part of the npm package.

**Ship right now instead of waiting for Monday:** merge the "Version Packages"
PR, or run the workflow by hand — Actions → *Release* → **Run workflow**. The
manual run takes the same path as the weekly one, with a toggle to turn off the
automatic patch bump.

> **Branch protection:** the weekly release pushes its version commit straight
> to `main`. If you protect `main`, allow `github-actions[bot]` to bypass the
> restriction (Settings → Branches → *Allow specified actors to bypass required
> pull requests*), or the run fails at the push step.
>
> **Pushes by `GITHUB_TOKEN` don't trigger workflows** — that's deliberate here.
> It's why the weekly run has to publish in the same job rather than letting the
> version commit start a second run, and it means there's no risk of a release
> loop.

## Turning the automation off

The weekly release is the `schedule:` trigger in
[`.github/workflows/release.yml`](.github/workflows/release.yml). Delete it and
you're back to "nothing publishes until a human merges the version PR". Keep the
schedule but want changesets to stay mandatory? Set `AUTO_PATCH` to `false` in
the *Decide what to release* step — pending changesets still ship weekly, but
nothing is bumped on its own.

## One-time setup (required before the first automated publish)

Trusted Publishing must be enabled on npm once. The very first publish will fail
until this is done.

1. Sign in at <https://www.npmjs.com> as a user with publish rights to `tabbied`.
2. Go to the package page → **Settings** →
   **Trusted Publisher** (a.k.a. "Publishing access").
3. Add a **GitHub Actions** trusted publisher with:
   - **Organization or user:** `subwaymatch`
   - **Repository:** `tabbied`
   - **Workflow filename:** `release.yml`
   - **Environment:** leave blank (the workflow doesn't use a GitHub Environment)
4. Save.

That's it — `secrets.GITHUB_TOKEN` (provided automatically by Actions) covers the
PR creation and changelog generation; no other secrets are needed.

> **Prefer a token instead?** Create an npm **automation** access token, add it as
> the `NPM_TOKEN` repository secret, set `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`
> on the publish step, and add `--provenance` to the publish command. Trusted
> publishing is recommended because there is no long-lived secret to rotate.

## Notes & troubleshooting

- **`npm error need auth` / OIDC errors on publish:** confirm the trusted
  publisher above is configured for `release.yml`, and that the workflow keeps
  `permissions: id-token: write`. OIDC publishing also needs a recent npm, which
  the workflow's `npm install -g npm@latest` step ensures.
- **Build artifacts:** `packages/tabbied/dist` is git-ignored and rebuilt in CI;
  `prepublishOnly` is a backstop, and the workflow also builds explicitly before
  publishing. The published tarball only contains `dist` and `patterns` (see the
  package's `files` field).
- **Workspace link:** the root app depends on `"tabbied": "*"` so the local
  workspace copy stays linked across version bumps — don't pin it back to an
  exact version.
- **First release / changelog credits:** changelogs are generated by
  `@changesets/changelog-github`, which links PRs and credits authors. Run
  `npm run version-packages` locally only if you set a `GITHUB_TOKEN` in your
  environment; normally the CI bot does this for you.
