# Flames Photography Storage Root

This directory holds **live, persistent server-side data** — it is NOT
sample data and must never be treated as disposable build output.

## What lives here
- `db_manifest.json` — fallback JSON datastore used only when the MySQL
  database is unreachable (see `server/database/persistentStore.ts`). Admin
  credentials are never stored here (see `server/repositories/adminRepository.ts`).
- `splash/`, `homepage/front/`, `homepage/back/`, `projects/`, `logos/` —
  every image an admin uploads through the `/fire` panel is written to disk
  here by Multer (`server/middleware/uploadMiddleware.ts`).

## Why this folder is gitignored (except `.gitkeep` placeholders)

`storage/db_manifest.json` and every uploaded image used to be committed to
git. That meant every `git push` → Hostinger deploy overwrote the live file
with whatever stale snapshot happened to be in the repo, silently resetting
site content and images back to an old state. This is now fixed:

- Only the empty folder structure (`.gitkeep` files) is tracked in git.
- Real uploaded media and the JSON fallback store are excluded via
  `.gitignore` and live only on the server's persistent filesystem.

## CODE vs DATABASE vs UPLOAD STORAGE

Keep these three concerns separate, per the project's core deployment rule:

| Layer | What it is | Where it lives | Deploy behavior |
|---|---|---|---|
| **CODE** | This git repository | GitHub → pulled to Hostinger | Replaced on every deploy |
| **DATABASE** | Admin credentials, site copy, social links, project/category records | MySQL (primary) | Must never be touched by a code deploy |
| **UPLOAD STORAGE** | Files in this `storage/` directory | Server's persistent disk | Must never be touched by a code deploy |

If your Hostinger deploy method ever does a **fresh checkout/rebuild**
instead of an in-place `git pull`, ask Hostinger support to confirm this
folder (and its contents) persist across deploys, or configure uploads to
write to a path outside the git working directory (e.g. a mapped persistent
volume) to be fully safe.
