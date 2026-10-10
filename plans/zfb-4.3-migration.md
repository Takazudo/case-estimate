# ZFB 4.3 core migration

## Scope and phases

Keep esbuild as the default bundler, the existing panel configurator behavior and manufacturing calculations, and the independent Docusaurus site. No merge, release, deployment, production writes, or new credentials. This task's PR preview is disabled by its exact branch name, without changing other PR preview eligibility.

1. **Baseline and architecture:** refresh main, inspect PRs and issues #95/#94, verify published 4.3.0 behavior against its tagged source, install with pnpm 10, record application/doc builds and existing test failures.
2. **Import boundary:** relocate the ZFB project from `zfb-app` to the repository root. Current 4.3 still shadow-copies its project root; above-root shared imports are outside that boundary. Keep documentation and formatter workspace packages separate. Validate relocation before changing runtime versions.
3. **Owned runtime:** pin ZFB/runtime 4.3.0; port React state, effects, references, context, portal dialogs, canvas and foreign SVG ownership to signals and activation/disposal scopes. Pass live signals through child component props. Keep data, URL encoding, panel mappings and calculation functions unchanged. Convert Tailwind theme/reset/utilities to Wind plus explicit authored rules. Preserve supported MDX island wrappers and built-in components.
4. **Acceptance:** integrate reviewed component groups, run type/lint/format/unit checks, ZFB check and Wind audit, application/doc builds, all 16 panel mapping checks, existing browser suite, and focused real interactions. Compare failures with the baseline and issue #94; leave stale assertions and skips visible. Publish a draft PR and inspect batched CI on the final head. Native macOS checks remain separate.

## Baseline

Main: `49fe131e9a151df4a937bd1879feef9978fdadc1`; no open PRs at inspection. Issue #95's earlier unpushed 4.0 checkpoint was unavailable from the remote, so this branch starts from main.

Node 24.19.0, pnpm 10.34.6. Default environment pnpm 11 failed the repository's existing build approval policy; rerunning frozen installation with pnpm 10 passed.

- `pnpm run typecheck`: passed.
- `pnpm run lint`: passed.
- `pnpm run test:run`: 5 files / 100 tests passed.
- Guarded `pnpm run build:with-docs`: passed.
- Guarded `pnpm exec playwright test --reporter=line`: 63 passed, 4 failed, 27 skipped. All 16 builder panel mapping checks passed.
- Three `color-selection-bug.spec.ts` failures use `/m?…`, whose preview redirect drops query parameters, and one also expects a missing custom button. One `gallery.spec.ts` arrow navigation check timed out. These are baseline failures, not migration regressions. Existing issue #94 tracks stale/skipped browser coverage; this migration does not mechanically rewrite or quarantine assertions.

## Runtime decisions

React/Headless UI compatibility is not provided by ZFB 4.3. Replace their application runtime usage with owned components, scope-owned control modals and native image/mobile dialogs, preserving focus restoration, Escape/backdrop handling, locking, and existing animation timing. Each island owns its navigation state explicitly; avoid context leaking across separate islands. Browser resources are created at activation and disposed with their scope.

Range values synchronize via explicit DOM references and effects. Local storage starts from SSR defaults and loads on activation. Foreign SVG fetches abort on disposal and repaint for live state. Pattern swatches use deterministic isolated SVG image documents; client-only visualization patterns use unique IDs. MDX fixed-target island wrappers return a Fragment as required by the current scanner.

The Docusaurus workspace retains its React dependency and build pipeline. No native Mac or production-host redirect result can be inferred from cloud Chromium checks.
