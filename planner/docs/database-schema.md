# Database Schema - Household Planner

## Overview
The database uses PostgreSQL (via Supabase) with Row Level Security (RLS) to ensure users can only access their own data.

---

## Tables

### 1. **auth.users** (Supabase Built-in)
Managed by Supabase Authentication system.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, user identifier |
| email | VARCHAR | User's email address |
| created_at | TIMESTAMP | Account creation time |

---

### 2. **rooms**
Stores the different areas/rooms in a user's household.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → auth.users(id), NOT NULL | Owner of the room |
| name | VARCHAR(100) | NOT NULL | Room name (e.g., "Kitchen", "Bathroom") |
| description | TEXT | | Additional details about the room |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_rooms_user_id` on `user_id`

**Relationships:**
- **One-to-Many** with `maintenance_items` (one room has many tasks)

---

### 3. **frequencies**
Defines maintenance frequency schedules.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → auth.users(id), NOT NULL | Owner of the frequency |
| name | VARCHAR(50) | NOT NULL | Frequency name (e.g., "Weekly", "Monthly") |
| days | INTEGER | NOT NULL | Number of days between maintenance |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |

**Indexes:**
- `idx_frequencies_user_id` on `user_id`

**Relationships:**
- **One-to-Many** with `maintenance_items` (one frequency used by many tasks)

**Common Values:**
- Daily: 1 day
- Weekly: 7 days
- Bi-weekly: 14 days
- Monthly: 30 days
- Quarterly: 90 days
- Bi-annually: 180 days
- Annually: 365 days

---

### 4. **maintenance_items**
The main table storing household maintenance tasks.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → auth.users(id), NOT NULL | Owner of the task |
| room_id | UUID | FOREIGN KEY → rooms(id), NOT NULL | Which room this task belongs to |
| frequency_id | UUID | FOREIGN KEY → frequencies(id) | How often task repeats (nullable) |
| name | VARCHAR(200) | NOT NULL | Task name (e.g., "Clean refrigerator") |
| description | TEXT | | Additional task details |
| last_completed | TIMESTAMP | | When task was last completed |
| next_due | TIMESTAMP | | When task is next due |
| status | VARCHAR(20) | DEFAULT 'pending' | Task status: 'pending', 'completed', 'overdue' |
| priority | VARCHAR(20) | DEFAULT 'medium' | Priority level: 'low', 'medium', 'high' |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_maintenance_items_user_id` on `user_id`
- `idx_maintenance_items_room_id` on `room_id`
- `idx_maintenance_items_status` on `status`
- `idx_maintenance_items_next_due` on `next_due`

**Relationships:**
- **Many-to-One** with `rooms` (many tasks in one room)
- **Many-to-One** with `frequencies` (many tasks share one frequency)
- **Many-to-One** with `auth.users` (many tasks belong to one user)

---

## Entity Relationships

```
auth.users (1) ──────┬──────> (N) rooms
                     │
                     ├──────> (N) frequencies
                     │
                     └──────> (N) maintenance_items
                     
rooms (1) ──────────────────> (N) maintenance_items

frequencies (1) ─────────────> (N) maintenance_items
```

**Cardinality:**
- 1 User → Many Rooms
- 1 User → Many Frequencies
- 1 User → Many Maintenance Items
- 1 Room → Many Maintenance Items
- 1 Frequency → Many Maintenance Items

---

## Row Level Security (RLS)

All tables have RLS policies ensuring users can only:
- **SELECT** their own records
- **INSERT** records with their own user_id
- **UPDATE** their own records
- **DELETE** their own records

**Policy Pattern:**
```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

---

## Cascade Rules

**On User Deletion:**
- All `rooms`, `frequencies`, and `maintenance_items` are **CASCADE DELETED**

**On Room Deletion:**
- All associated `maintenance_items` are **CASCADE DELETED**

**On Frequency Deletion:**
- Associated `maintenance_items` have `frequency_id` **SET TO NULL**

---

## Triggers

### Auto-Update Timestamps
- `update_rooms_updated_at` - Updates `rooms.updated_at` on modification
- `update_maintenance_items_updated_at` - Updates `maintenance_items.updated_at` on modification

---

## Query Examples

### Get all maintenance items with room and frequency details
```sql
SELECT 
    mi.*,
    r.name as room_name,
    f.name as frequency_name,
    f.days as frequency_days
FROM maintenance_items mi
LEFT JOIN rooms r ON mi.room_id = r.id
LEFT JOIN frequencies f ON mi.frequency_id = f.id
WHERE mi.user_id = auth.uid()
ORDER BY mi.next_due ASC;
```

### Get overdue tasks
```sql
SELECT mi.*, r.name as room_name
FROM maintenance_items mi
JOIN rooms r ON mi.room_id = r.id
WHERE mi.user_id = auth.uid()
  AND mi.next_due < NOW()
  AND mi.status = 'pending';
```

### Get tasks by room
```sql
SELECT mi.*, f.name as frequency_name
FROM maintenance_items mi
LEFT JOIN frequencies f ON mi.frequency_id = f.id
WHERE mi.user_id = auth.uid()
  AND mi.room_id = 'room-uuid-here';
```

### Get tasks by frequency
```sql
SELECT mi.*, r.name as room_name
FROM maintenance_items mi
JOIN rooms r ON mi.room_id = r.id
WHERE mi.user_id = auth.uid()
  AND mi.frequency_id = 'frequency-uuid-here';
```

---

## Current Filter Views (App UI)

| Filter | Purpose |
|--------|---------|
| **Frequency** | Group/sort tasks by maintenance frequency |
| **Area** | Group/sort tasks by room/area |
| **Hybrid** | Combined view of frequency and area |
| **Minimal** | Simplified view with essential info only |

---

## Future Enhancements

- **Tags table** for categorization (cleaning, maintenance, seasonal, etc.)
- **Task history table** to track completion records
- **Notifications table** for reminders
- **Shared households** with multi-user support
- **Attachments** for photos/documents
- **Templates** for common maintenance routines
