# Skillverse Python backend

Replaces the Google Apps Script. Data is stored in SQLite (`backend/skillverse.db`, created automatically).

## Run
```
cd backend
pip install -r requirements.txt
ADMIN_TOKEN=choose-a-long-secret uvicorn main:app --host 0.0.0.0 --port 8000
```
Open http://localhost:8000 (the server also serves the website).
On Windows PowerShell: `$env:ADMIN_TOKEN="choose-a-long-secret"; uvicorn main:app --port 8000`

## Endpoints
- `POST /api`  feedback or contact form (used by the site)
- `GET  /api`  public reviews, no emails
- `GET  /admin/export.xlsx?token=SECRET`  Excel with Feedback + Contacts sheets
- `GET  /admin/contacts?token=SECRET`     contacts as JSON
- `DELETE /admin/feedback/{id}?token=SECRET`  remove a review

## Settings (environment variables)
- `ADMIN_TOKEN`: required for the /admin routes (empty = disabled)
- `DB_PATH`: database file location (default backend/skillverse.db)
- `ALLOWED_ORIGINS`: comma-separated list; default `*`. Set to your site URL if hosted on another domain.

## Hosting the site elsewhere
If the frontend is on a different host, set `SHEET_URL` in `config.js` to the full URL, e.g. `https://your-server.com/api`.

## Deploying
Any host that runs Python works (Render, Railway, a VPS). Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
Keep the .db file on a persistent disk, or it resets on redeploy.
