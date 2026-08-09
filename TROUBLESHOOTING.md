# Troubleshooting — React + Vite on GitHub Pages

Symptom → fix map for deploying this Vite app. **Read this first** when a build or
deploy misbehaves. Each entry is `if <symptom> → then <fix>`.

## Deployment source (read this FIRST)

- **Pages Source MUST be "GitHub Actions".** This repo ships a workflow that builds
  `dist/` and deploys it as a Pages artifact. Pages must be set to **Settings → Pages
  → Build and deployment → Source: GitHub Actions** — NOT "Deploy from a branch".
  KnowGitty configures this automatically when it creates the project, so this
  mainly matters if someone changed it, or if Pages was set up by hand.
- **If a custom workflow exists AND Pages says "Deploy from a branch" → switch to
  GitHub Actions.** Never run both deployment methods: branch mode serves the SOURCE
  `index.html` (which references `/src/main.jsx`) instead of the built `dist/`, so you
  get a **blank page** even though the Actions run is green.
- **Workflow green but the live page is BLANK → check the Pages Source FIRST**, then
  open the browser console and fix the FIRST red error. A green build+deploy with a
  blank page is almost always the wrong Pages Source (branch mode), not a build bug.
- **Node.js deprecation warnings in the Actions log, with the build + deploy still
  green → ignore them.** They are maintenance/version-support warnings from the
  actions, NOT the cause of an outage. Only investigate steps that actually fail.
- **This repository is PUBLIC.** GitHub Pages on free accounts requires a public repo,
  so anyone can read every file. **Never commit tokens, credentials, private keys,
  API secrets, internal URLs, or personal data** — treat everything here as world-
  readable.

## Success criteria (what a healthy deploy looks like)

- **Pages Source = GitHub Actions** (not "Deploy from a branch").
- The **build** job is green and produces the `dist/` artifact (`path: ./dist`).
- The **deploy** job is green.
- The live page loads its JS/CSS from `/<repo>/assets/…` (HTTP 200, correct MIME).
- The UI actually renders at `https://<user>.github.io/<repo>/` — not a blank page,
  no `/src/main.jsx` request in the console.

## Build & lockfile

- **`package-lock.json` is missing AND the workflow uses `npm ci` or `cache: npm`**
  → `npm ci` and npm caching both REQUIRE a committed lockfile and fail the first
  deploy without one. Either run `npm install` locally and commit the generated
  `package-lock.json`, or keep the workflow on `npm install` with no npm cache
  config (this repo ships this way).
- **`npm run build` fails** → fix the build first. Until it succeeds there is no
  valid `dist/` artifact to deploy; nothing downstream can work.
- **`npm install` succeeds but the live site still serves source files** → this is a
  deployment/config issue, not a dependency issue. Check the base path, the upload
  path, and the Pages source (below).

## Base path & assets

- **App served under a subdirectory** (e.g. `https://<user>.github.io/my-app/`) →
  set the Vite base to that subdirectory (`/my-app/`). This repo does it via the
  `VITE_BASE=/<repo-name>/` env in the workflow build step.
- **App served at the domain root** (custom domain, or `<user>.github.io`) → set the
  Vite base to `/` (remove the `VITE_BASE` env from the workflow, or set it to `/`).
- **JS/CSS assets return 404** → the Vite `base` does not match where the site is
  actually served. Check: base vs deployment subdirectory, the artifact/upload path,
  and any reverse-proxy rewrites.
- **The page loads but is unstyled** → the CSS bundle must return HTTP 200 and its
  path must match the Vite base. A 404 on the CSS = wrong base.
- **Images or fonts 404** → import them from `src/` (so Vite fingerprints + rebases
  them), or put them in `public/` and reference them with the correct base prefix.

## Deployment source & artifacts

- **Workflow uploads the repo root instead of the build output** → set the upload
  path to `./dist` (this repo already does).
- **The live HTML differs from `dist/index.html`** → the wrong output is being
  served. Fix the hosting source / docroot / artifact path / proxy target so the
  built `dist/index.html` is what ships.
- **Browser requests `/src/main.jsx` on the live site** → production is serving the
  source `index.html`, not the built one. Serve `dist/index.html` (the built HTML
  references `/assets/*.js`, not `/src/main.jsx`).
- **Console shows `src/main.jsx` 404** → verify `npm run build` completed and that
  the deployed HTML references `/assets/*.js` (or `/<subdir>/assets/*.js`).
- **A host deploys from a branch while a workflow also deploys artifacts** → pick
  ONE deployment method and disable the other. In repo **Settings → Pages → Source**
  choose **GitHub Actions** (not "Deploy from a branch"); never both.
- **JS files return HTML instead of JavaScript** → a catch-all/SPA rewrite is
  redirecting asset requests to `index.html`. Fix the rewrite so real asset paths
  are served as files.
- **Wrong MIME types** → serve `.js` as `application/javascript` and `.css` as
  `text/css` (GitHub Pages does this automatically; custom hosts may not).

## Blank page & runtime

- **No `<div id="root">` in the served HTML** → add the React mount element (this
  template's `index.html` already has it).
- **Root element exists but the screen is blank** → open the browser console and fix
  the FIRST reported error; later errors are usually downstream of it.
- **The bundle loads but React does not render** → check `createRoot`, your imports,
  component-level errors, missing env vars, and any unsupported browser APIs.
- **`window` / `document` / `localStorage` / `location` used during SSR** → move the
  access into `useEffect`, or guard with `typeof window !== "undefined"`.
- **A direct-in-browser fallback script is present** → it is a temporary crutch;
  remove it once `dist/` is served correctly.

## Routing

- **Hash navigation** → the server serves one `index.html`; use links like
  `#home` / `#about`.
- **History-mode routes on static hosting** → add a fallback rewrite to
  `index.html`, or switch to hash routing.
- **Refreshing a client-side route 404s** → configure an SPA fallback (a `404.html`
  that mirrors `index.html`, or hash routing).

## Custom domains & caching

- **Custom domain serves the repo root instead of `dist/`** → configure the host to
  publish `dist/`, or deploy `dist/` through the host's own pipeline.
- **Custom domain points at another server / reverse proxy** → configure it to serve
  `dist/` and preserve asset paths.
- **Workflow succeeds but the domain shows old content** → check DNS, the custom
  domain settings, CDN cache, the deployment environment, and whether another server
  answers on that hostname.

## Env vars & API calls

- **Env vars work locally but fail in production** → client-exposed vars must be
  prefixed `VITE_` AND be defined in the deployment environment, not just `.env.local`.
- **An API works locally but fails in production** → check the production API URL,
  CORS, HTTPS, auth, and any proxy config.

## Clean-setup checklist (the reliable final state)

1. Commit `package-lock.json` (after first `npm install`).
2. `npm ci` in CI (only after the lockfile is committed; else `npm install`).
3. `npm run build` produces `dist/`.
4. Upload `./dist` as the Pages artifact.
5. Vite `base` matches where the site is served (`/<repo>/` for project sites, `/`
   for root/custom-domain).
6. Exactly ONE deployment source (Settings → Pages → GitHub Actions).
7. The domain points at that deployment.
8. Remove any temporary in-browser fallback scripts.
9. Standard Vite `index.html` (`<div id="root">` + the built module script).
10. JS and CSS bundles all return HTTP 200.