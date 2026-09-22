# Reading Companion

A children's reading companion web app. Teachers and students will each have their own flow. This is a static frontend only (no backend, database, or authentication).

The app is set up with Vite + React and `HashRouter` so it can later be deployed to GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

Because routing uses hash URLs, the screens are:

- Home: `/#/`
- Teacher: `/#/teacher`
- Student: `/#/student`

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

In `vite.config.js`, `base` is currently `'./'` (relative asset paths).

If you need a repo-name base path instead, change it to `/YOUR_GITHUB_REPO_NAME/` — replace `YOUR_GITHUB_REPO_NAME` with this repository's name (for example `/vaayana/`).
