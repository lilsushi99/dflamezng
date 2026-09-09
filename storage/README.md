# Flames Photography Storage Root

This directory is the **local development default** for persistent,
live server-side data. It is NOT sample data and must never be treated as
disposable build output.

## What lives here
- `db_manifest.json` — fallback JSON datastore used only when the MySQL
  database is unreachable (see `server/database/persistentStore.ts`). Admin
  credentials are never stored here (see `server/repositories/adminRepository.ts`).
- `splash/`, `homepage/front/`, `homepage/back/`, `projects/`, `logos/`, `seo/` —
  every image an admin uploads through the `/fire` panel is written to disk
  here by Multer (`server/middleware/uploadMiddleware.ts`).

## ⚠️ Production MUST set PERSISTENT_STORAGE_PATH ⚠️

`storage/db_manifest.json` and uploaded images used to be committed to git,
which meant every deploy overwrote live content with a stale snapshot. That
was fixed by gitignoring them — but gitignoring alone is **not enough** if
your deploy method recreates the live folder from a fresh git checkout
(common with "Deploy from GitHub" style panels, including some Hostinger
setups): a fresh checkout only contains what's tracked in git, so anything
gitignored simply won't exist in the new checkout either.

The real fix: set the `PERSISTENT_STORAGE_PATH` environment variable (see
`server/config/storage.ts`) to an **absolute path outside this repository's
deployed folder** — somewhere your host never touches during a deploy. Once
set, all uploads and the fallback datastore are written there instead of
inside `storage/`, and they survive redeploys no matter how the deploy
mechanism works.

Steps for Hostinger:
1. Via File Manager or SSH, create a folder outside your git-deployed app
   directory, e.g. `/home/<your-hostinger-username>/dflamez-persistent-storage`.
2. In your Hostinger Node.js app's environment variables panel, add:
   `PERSISTENT_STORAGE_PATH=/home/<your-hostinger-username>/dflamez-persistent-storage`
3. Redeploy once. The app will create the `splash/`, `homepage/`, `projects/`,
   `logos/`, `seo/` subfolders there automatically on next boot.
4. If you had images live on the site before this change, copy the contents
   of the old in-repo `storage/` folder into the new location once, via File
   Manager or SSH, so existing uploads aren't lost.

If `PERSISTENT_STORAGE_PATH` is not set, the app falls back to this local
`storage/` folder — fine for local development, unsafe for production.

## CODE vs DATABASE vs UPLOAD STORAGE

| Layer | What it is | Where it lives | Deploy behavior |
|---|---|---|---|
| **CODE** | This git repository | GitHub → pulled to Hostinger | Replaced on every deploy |
| **DATABASE** | Admin credentials, site copy, social links, project/category records | MySQL (primary) | Must never be touched by a code deploy |
| **UPLOAD STORAGE** | Uploaded media + fallback JSON store | `PERSISTENT_STORAGE_PATH`, outside the repo | Must never be touched by a code deploy |

Also double-check `/api/health` on your live site — its `database.mode`
field tells you whether MySQL is actually connected in production or if the
app has been silently running on the JSON fallback store. If it says
"Active Local Repository Fallback", your MySQL environment variables aren't
configured correctly on Hostinger and need fixing too - the fallback store
is a safety net for outages, not meant to be the primary datastore.
