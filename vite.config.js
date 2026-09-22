import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // UPDATE BEFORE GITHUB PAGES DEPLOY:
  // `./` uses relative asset URLs and works for local `npm run dev`.
  // For a GitHub Pages *project* site (https://USER.github.io/REPO/),
  // you may instead set: base: '/YOUR_GITHUB_REPO_NAME/'
  // Replace YOUR_GITHUB_REPO_NAME with the actual repository name, e.g. '/vaayana/'
  base: '/vaayana/',
})
