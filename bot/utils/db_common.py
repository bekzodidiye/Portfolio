import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "bot_database.sqlite"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        full_name TEXT,
        language TEXT DEFAULT 'uz',
        joined_at TEXT,
        last_active TEXT
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_name TEXT,
        contact_info TEXT,
        message_text TEXT,
        created_at TEXT
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS portfolio_visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_name TEXT,
        visitor_role TEXT,
        ip TEXT,
        country TEXT,
        city TEXT,
        street TEXT,
        device_type TEXT,
        os TEXT,
        browser TEXT,
        gpu TEXT,
        referrer TEXT,
        latitude REAL,
        longitude REAL,
        visited_at TEXT
    )
    """)
    conn.commit()
    conn.close()
