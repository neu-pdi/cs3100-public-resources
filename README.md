# CS 3100 — Landing Page

Hub page for [CS 3100: Program Design and Implementation II](https://neu-pdi.github.io/cs3100-public-resources/) at Northeastern University. Lists all course offerings and links to each semester's archived site.

## How it works

Single static `index.html` served by GitHub Pages from the `main` branch. No build step, no framework.

Each semester has its own repo (e.g. `CS3100-Spring-2026`, `CS3100-Summer-2026`) deployed to its own GitHub Pages URL. This repo just provides a stable landing where anyone visiting the canonical URL can pick an offering.

## Adding a new semester

Edit `index.html`. Add an `<li class="offering">` entry to the `<ul class="offerings">` list. Move the previous term's tag from `current` to `archived` and remove the `upcoming` class from the new term once its site is live.

Tags: `current`, `upcoming` (adds `.upcoming` class to the `<li>` to disable the link), `archived`.

## Deployment

Settings → Pages → Deploy from branch → `main` / `/` (root).

## Temporary deep-link redirect

`404.html` rewrites any missing path under `/cs3100-public-resources/` to the corresponding path under `/CS3100-Spring-2026/`. This preserves existing student bookmarks and shared links for the semester that just ended.

**Delete `404.html` when you no longer want this behavior** (e.g., once Summer 2026 is live and links have migrated).
