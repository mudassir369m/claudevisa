# Railway Deployment

## 1. Push repo to GitHub

```bash
git init && git add . && git commit -m "initial"
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

## 2. Create Railway project

Railway dashboard → **New Project** → **Deploy from GitHub repo** → select repo.

Railway auto-detects the `Dockerfile` and builds.

## 3. Add environment variables

Project → **Variables** tab → paste (replace values):

```
NODE_ENV=production
ADMIN_EMAIL=admin@neweuroconsultants.com
ADMIN_PASSWORD=<strong-password-16chars-min>
SESSION_SECRET=<paste output of: openssl rand -base64 32>
NEXT_PUBLIC_SITE_URL=https://neweuroconsultants.com
DATA_DIR=/app/data
UPLOAD_DIR=/app/data/uploads
PORT=3000
```

Generate `SESSION_SECRET` locally:
```bash
openssl rand -base64 32
```

## 4. Attach persistent volume (critical)

Without a volume, uploads and content JSON are lost on every deploy/restart.

Project → **Settings** → **Volumes** → **New Volume**:
- **Mount path**: `/app/data`
- **Size**: `5 GB` (increase later if needed — videos eat space fast)

Redeploy after adding the volume.

## 5. Health check

Already wired to `/api/health` via `railway.json`. First deploy takes 3-5 min.

## 6. Verify

```bash
curl https://<project>.up.railway.app/api/health
# → {"ok":true}
```

Then hit `/admin/login` and sign in.

## 7. Custom domain

Project → **Settings** → **Networking** → **Custom Domain** → add `neweuroconsultants.com`.

Railway shows a CNAME target. In your DNS provider (Cloudflare / Namecheap):

- Type: `CNAME`
- Host: `@` (or `www`)
- Value: `<railway-cname-target>`
- Proxy: **DNS only** (grey cloud on Cloudflare) for first cert issuance, then can enable proxy

SSL auto-provisions in ~2 min after DNS propagates.

## 8. Deploying updates

```bash
git commit -am "update"
git push
```

Railway auto-deploys on push to main.

## How uploads persist

- Admin uploads → `UPLOAD_DIR` (`/app/data/uploads`) → survives restarts (volume).
- Public URL `/uploads/xxx.jpg` → rewrite to `/api/media/xxx.jpg` → streams from volume → cached 1 year.
- Content JSON at `/app/data/content.json` → same volume.
- Leads JSON at `/app/data/leads.json` → same volume.

## Backups

The volume is Railway-managed but **not snapshotted**. Weekly backup:

```bash
# From admin/content → Raw JSON tab → copy all → save to git or drive
```

Or scheduled backup via `railway run` cron — ask if you want a script.

## Cost estimate

- Hobby plan: $5/mo (fits ~500 hrs runtime + 5GB volume)
- Pro: $20/mo (unlimited hours, better for production)

## Troubleshooting

| Symptom | Fix |
|---|---|
| Admin login → back to login | `SESSION_SECRET` missing / cookies blocked → verify env var, ensure HTTPS |
| Uploads 404 after redeploy | Volume not mounted at `/app/data` → check Settings → Volumes |
| Content resets to defaults | `DATA_DIR` not `/app/data` → check env var |
| Build fails on `sharp` / native | Add `NPM_FLAGS=--legacy-peer-deps` (already in Dockerfile) |
| Health check timeout | First boot slow → increase `healthcheckTimeout` in `railway.json` to 300 |
