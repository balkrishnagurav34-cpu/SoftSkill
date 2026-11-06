"""
Skillverse backend (FastAPI + SQLite).

Replaces the Google Apps Script. Same contract the website already uses:
  POST /api   body = JSON text (type "contact" -> Contacts, otherwise Feedback)
  GET  /api   -> {"ok": true, "reviews": [...]}   (no emails, newest first)

Extras (protected by ADMIN_TOKEN):
  GET /admin/export.xlsx?token=...   download Feedback + Contacts as Excel
  GET /admin/contacts?token=...      contacts as JSON
  DELETE /admin/feedback/{id}?token=...   remove a review

The website files (index.html, etc.) are served from the parent folder, so one
server runs everything.
"""
import io
import json
import os
import re
import sqlite3
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

BASE = Path(__file__).resolve().parent
SITE = BASE.parent
DB_PATH = os.environ.get("DB_PATH", str(BASE / "skillverse.db"))
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")  # set this! empty = admin disabled
ALLOWED_ORIGINS = [o for o in os.environ.get("ALLOWED_ORIGINS", "*").split(",") if o]
MAX_BODY = 8 * 1024
RATE_LIMIT = 10      # max submissions ...
RATE_WINDOW = 60     # ... per this many seconds, per IP

app = FastAPI(title="Skillverse API", docs_url=None, redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

_db_lock = threading.Lock()


def db():
    con = sqlite3.connect(DB_PATH, check_same_thread=False)
    con.row_factory = sqlite3.Row
    return con


def init_db():
    with _db_lock, db() as con:
        con.executescript(
            """
            CREATE TABLE IF NOT EXISTS feedback(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              time TEXT, name TEXT, email TEXT, rating INTEGER, message TEXT);
            CREATE TABLE IF NOT EXISTS contacts(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              time TEXT, name TEXT, email TEXT, phone TEXT, message TEXT);
            """
        )


init_db()


def clean(v, n):
    s = "" if v is None else str(v)
    s = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", s)  # strip control chars
    return s.strip()[:n]


_hits = {}


def rate_ok(ip):
    now = time.time()
    q = [t for t in _hits.get(ip, []) if now - t < RATE_WINDOW]
    if len(q) >= RATE_LIMIT:
        _hits[ip] = q
        return False
    q.append(now)
    _hits[ip] = q
    return True


def client_ip(req: Request):
    fwd = req.headers.get("x-forwarded-for")
    return fwd.split(",")[0].strip() if fwd else (req.client.host if req.client else "?")


@app.post("/api")
async def submit(req: Request):
    # The site sends JSON as text/plain (to avoid CORS preflight), so parse the raw body.
    raw = await req.body()
    if len(raw) > MAX_BODY:
        return JSONResponse({"ok": False}, status_code=413)
    if not rate_ok(client_ip(req)):
        return JSONResponse({"ok": False, "error": "too many requests"}, status_code=429)
    try:
        d = json.loads(raw.decode("utf-8"))
        if not isinstance(d, dict):
            raise ValueError
    except Exception:
        return JSONResponse({"ok": False}, status_code=400)

    if d.get("website"):  # honeypot field: bots fill it, humans don't
        return {"ok": True}

    t = clean(d.get("time"), 40) or datetime.now(timezone.utc).isoformat()
    name = clean(d.get("name"), 60)
    email = clean(d.get("email"), 100)
    message = clean(d.get("message"), 500)

    with _db_lock, db() as con:
        if d.get("type") == "contact":
            con.execute(
                "INSERT INTO contacts(time,name,email,phone,message) VALUES(?,?,?,?,?)",
                (t, name, email, clean(d.get("phone"), 20), message),
            )
        else:
            try:
                rating = max(1, min(5, round(float(d.get("rating") or 0))))
            except (TypeError, ValueError):
                rating = 1
            con.execute(
                "INSERT INTO feedback(time,name,email,rating,message) VALUES(?,?,?,?,?)",
                (t, name, email, rating, message),
            )
    return {"ok": True}


@app.get("/api")
def reviews():
    # Public: never returns emails; contacts are never exposed here.
    with _db_lock, db() as con:
        rows = con.execute(
            "SELECT time,name,rating,message FROM feedback "
            "WHERE name!='' AND message!='' ORDER BY id DESC LIMIT 200"
        ).fetchall()
    return {"ok": True, "reviews": [dict(r) for r in rows]}


# ---------- admin ----------
def need_admin(token: str):
    if not ADMIN_TOKEN or token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="forbidden")


@app.get("/admin/contacts")
def admin_contacts(token: str = ""):
    need_admin(token)
    with _db_lock, db() as con:
        rows = con.execute("SELECT * FROM contacts ORDER BY id DESC").fetchall()
    return [dict(r) for r in rows]


@app.delete("/admin/feedback/{fid}")
def admin_delete(fid: int, token: str = ""):
    need_admin(token)
    with _db_lock, db() as con:
        con.execute("DELETE FROM feedback WHERE id=?", (fid,))
    return {"ok": True}


@app.get("/admin/export.xlsx")
def admin_export(token: str = ""):
    need_admin(token)
    from openpyxl import Workbook

    wb = Workbook()
    ws = wb.active
    ws.title = "Feedback"
    ws.append(["ID", "Time", "Name", "Email", "Rating", "Message"])
    ws2 = wb.create_sheet("Contacts")
    ws2.append(["ID", "Time", "Name", "Email", "Phone", "Message"])

    def put(sheet, values):
        sheet.append(values)
        for c in sheet[sheet.max_row]:  # force text so "=..." / "+91..." never act as formulas
            if isinstance(c.value, str):
                c.data_type = "s"

    with _db_lock, db() as con:
        for r in con.execute("SELECT * FROM feedback ORDER BY id"):
            put(ws, [r["id"], r["time"], r["name"], r["email"], r["rating"], r["message"]])
        for r in con.execute("SELECT * FROM contacts ORDER BY id"):
            put(ws2, [r["id"], r["time"], r["name"], r["email"], r["phone"], r["message"]])

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="skillverse-data.xlsx"'},
    )


@app.get("/health")
def health():
    return {"ok": True}


# Serve the website itself (must be last so it doesn't shadow the routes above).
app.mount("/", StaticFiles(directory=str(SITE), html=True), name="site")
