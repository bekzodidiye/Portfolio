import json
import sqlite3
from pathlib import Path
from typing import List, Dict, Optional, Any
from datetime import datetime

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
    conn.commit()
    conn.close()

def save_or_update_user(user_id: int, username: Optional[str], full_name: str, language: str = 'uz'):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,))
    exists = cursor.fetchone()
    
    if exists:
        cursor.execute(
            "UPDATE users SET username = ?, full_name = ?, last_active = ? WHERE user_id = ?",
            (username, full_name, now, user_id)
        )
    else:
        cursor.execute(
            "INSERT INTO users (user_id, username, full_name, language, joined_at, last_active) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, username, full_name, language, now, now)
        )
    conn.commit()
    conn.close()

def set_user_language(user_id: int, language: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET language = ? WHERE user_id = ?", (language, user_id))
    conn.commit()
    conn.close()

def get_user_language(user_id: int) -> str:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT language FROM users WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else 'uz'

def get_all_user_ids() -> List[int]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM users")
    rows = cursor.fetchall()
    conn.close()
    return [r[0] for r in rows]

def get_stats() -> Dict[str, Any]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM messages")
    total_messages = cursor.fetchone()[0]
    
    cursor.execute("SELECT language, COUNT(*) FROM users GROUP BY language")
    lang_stats = dict(cursor.fetchall())
    
    conn.close()
    return {
        "total_users": total_users,
        "total_messages": total_messages,
        "languages": lang_stats,
    }

def get_recent_users(limit: int = 5) -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT user_id, username, full_name, language, last_active FROM users ORDER BY last_active DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [
        {"user_id": r[0], "username": r[1], "full_name": r[2], "language": r[3], "last_active": r[4]}
        for r in rows
    ]

def get_recent_messages(limit: int = 5) -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT user_id, user_name, contact_info, message_text, created_at FROM messages ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [
        {"user_id": r[0], "user_name": r[1], "contact_info": r[2], "message_text": r[3], "created_at": r[4]}
        for r in rows
    ]

def record_feedback(user_id: int, user_name: str, contact_info: str, message_text: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        "INSERT INTO messages (user_id, user_name, contact_info, message_text, created_at) VALUES (?, ?, ?, ?, ?)",
        (user_id, user_name, contact_info, message_text, now)
    )
    conn.commit()
    conn.close()
