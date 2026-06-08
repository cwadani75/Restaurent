import sqlite3
from pathlib import Path

root = Path('/home/cwadani75/development/code/projects/Restaurent/backend')
path = root / 'instance' / 'restaurant.db'
print('path', path, 'exists', path.exists(), 'size', path.stat().st_size if path.exists() else None)
if path.exists():
    conn = sqlite3.connect(path)
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print('tables', c.fetchall())
    try:
        c.execute('SELECT id, email, role, password_hash FROM users')
        print('all users:')
        for row in c.fetchall():
            print('  ', row)
    except Exception as e:
        print('error', e)
    conn.close()
