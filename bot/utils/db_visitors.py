import sqlite3
from typing import List, Dict, Optional, Any
from datetime import datetime
from bot.utils.db_common import DB_PATH

def record_visitor_visit(
    visitor_name: str,
    visitor_role: Optional[str],
    ip: str,
    country: Optional[str],
    city: Optional[str],
    street: Optional[str],
    device_type: Optional[str],
    os: Optional[str],
    browser: Optional[str],
    gpu: Optional[str],
    referrer: Optional[str],
    lat: Optional[float],
    lon: Optional[float]
):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        """INSERT INTO portfolio_visitors 
        (visitor_name, visitor_role, ip, country, city, street, device_type, os, browser, gpu, referrer, latitude, longitude, visited_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (visitor_name, visitor_role, ip, country, city, street, device_type, os, browser, gpu, referrer, lat, lon, now)
    )
    conn.commit()
    conn.close()

def get_visitor_stats() -> Dict[str, Any]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now_date = datetime.now().strftime("%Y-%m-%d")
    
    cursor.execute("SELECT COUNT(*) FROM portfolio_visitors")
    total_visits = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM portfolio_visitors WHERE visited_at LIKE ?", (f"{now_date}%",))
    today_visits = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(DISTINCT ip) FROM portfolio_visitors WHERE ip IS NOT NULL AND ip != ''")
    unique_ips = cursor.fetchone()[0]
    
    cursor.execute("SELECT device_type, COUNT(*) FROM portfolio_visitors GROUP BY device_type")
    devices = dict(cursor.fetchall())
    
    cursor.execute("SELECT city, COUNT(*) FROM portfolio_visitors WHERE city IS NOT NULL GROUP BY city ORDER BY COUNT(*) DESC LIMIT 5")
    top_cities = cursor.fetchall()
    
    cursor.execute("SELECT referrer, COUNT(*) FROM portfolio_visitors WHERE referrer IS NOT NULL GROUP BY referrer ORDER BY COUNT(*) DESC LIMIT 5")
    top_referrers = cursor.fetchall()
    
    conn.close()
    return {
        "total_visits": total_visits,
        "today_visits": today_visits,
        "unique_ips": unique_ips,
        "devices": devices,
        "top_cities": top_cities,
        "top_referrers": top_referrers,
    }

def get_recent_visitors(limit: int = 5) -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """SELECT id, visitor_name, visitor_role, ip, country, city, street, device_type, os, browser, latitude, longitude, visited_at 
        FROM portfolio_visitors ORDER BY id DESC LIMIT ?""",
        (limit,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r[0], "visitor_name": r[1], "visitor_role": r[2], "ip": r[3],
            "country": r[4], "city": r[5], "street": r[6], "device_type": r[7],
            "os": r[8], "browser": r[9], "latitude": r[10], "longitude": r[11],
            "visited_at": r[12],
        }
        for r in rows
    ]
