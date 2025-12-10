# Shared Database Schema

## Overview
This is the unified database schema for all applications in the Websites platform:
- **House Planner** - Household maintenance tracking
- **Habit Tracker** - Personal habit management
- **Personal Website** - Portfolio and schedule management

The schema uses PostgreSQL (via Supabase) with Row Level Security (RLS) and includes subscription management for unified access control across all apps.

---

## Architecture

### Multi-App Subscription Model
- **One User Account** - Single authentication across all apps
- **One Subscription** - Controls access to all apps simultaneously
- **Flexible Plans** - Free, Basic, Premium with different feature limits
- **Granular Control** - Per-app feature limits and overrides

---

## Core Tables

### 1. **subscription_plans**
Defines available subscription tiers and their features.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(50) | Internal plan identifier (e.g., 'free', 'basic') |
| display_name | VARCHAR(100) | User-facing plan name |
| description | TEXT | Plan description |
| price_monthly | DECIMAL(10,2) | Monthly price |
| price_yearly | DECIMAL(10,2) | Yearly price |
| is_active | BOOLEAN | Whether plan is currently available |
| features | JSONB | Global feature limits |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

**Default Plans:**
- **Free**: Limited access to all apps (3 rooms, 5 habits, 10 items)
- **Basic**: Standard access ($4.99/month, 10 rooms, 20 habits, 50 items)
- **Premium**: Unlimited access ($9.99/month, all features unlocked)

---

### 2. **subscriptions**
User's current subscription status.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to auth.users (unique) |
| plan_id | UUID | FK to subscription_plans |
| status | VARCHAR(20) | 'active', 'canceled', 'expired', 'trial' |
| started_at | TIMESTAMP | Subscription start date |
| expires_at | TIMESTAMP | Expiration date (null for lifetime) |
| auto_renew | BOOLEAN | Auto-renewal setting |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

**Business Rules:**
- One active subscription per user
- Free plan never expires
- Paid plans expire unless renewed

---

### 3. **app_access**
Defines which apps are included in each subscription plan.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| plan_id | UUID | FK to subscription_plans |
| app_name | VARCHAR(50) | App identifier ('house-planner', 'habit-tracker', 'personal-website') |
| feature_limits | JSONB | App-specific feature limits |
| created_at | TIMESTAMP | Creation time |

**Example Feature Limits:**
```json
{
  "max_rooms": 10,
  "max_items": 50,
  "advanced_features": true
}
```

---

### 4. **user_app_permissions**
User-specific overrides for app access (optional, for promotions/trials).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to auth.users |
| app_name | VARCHAR(50) | App identifier |
| has_access | BOOLEAN | Override access (true grants, false denies) |
| feature_overrides | JSONB | Custom limits for this user |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

**Use Cases:**
- Give beta access to specific users
- Promotional trials for single apps
- Custom enterprise limits

---

## House Planner Tables

### 5. **rooms**
User's household rooms/areas.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to auth.users |
| name | VARCHAR(100) | Room name |
| description | TEXT | Optional details |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

---

### 6. **frequencies**
Maintenance frequency schedules.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to auth.users |
| name | VARCHAR(50) | Frequency name (e.g., "Weekly") |
| days | INTEGER | Days between maintenance |
| created_at | TIMESTAMP | Creation time |

**Common Values:**
- Daily: 1 day
- Weekly: 7 days
- Monthly: 30 days
- Quarterly: 90 days
- Annually: 365 days

---

### 7. **maintenance_items**
Household maintenance tasks.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to auth.users |
| room_id | UUID | FK to rooms |
| frequency_id | UUID | FK to frequencies (nullable) |
| name | VARCHAR(200) | Task name |
| description | TEXT | Task details |
| last_completed | TIMESTAMP | Last completion time |
| next_due | TIMESTAMP | Next due date |
| status | VARCHAR(20) | 'pending', 'completed', 'overdue' |
| priority | VARCHAR(20) | 'low', 'medium', 'high' |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

---

## Habit Tracker Tables

**Status**: Placeholder - To be implemented

Tables will include:
- `habits` - User habit definitions
- `habit_logs` - Daily habit completion tracking
- `habit_streaks` - Streak calculations
- `habit_categories` - Optional categorization

---

## Personal Website Tables

**Status**: Placeholder - To be implemented if needed

Potential tables:
- `blog_posts` - Portfolio blog content
- `projects` - Project showcase items
- `schedule_events` - Calendar/schedule items

---

## Entity Relationships

```
auth.users (1) ──────┬──────> (1) subscriptions
                     │
                     ├──────> (N) user_app_permissions
                     │
                     ├──────> (N) rooms
                     ├──────> (N) frequencies
                     └──────> (N) maintenance_items

subscription_plans (1) ──────> (1) subscriptions
subscription_plans (1) ──────> (N) app_access

rooms (1) ──────────────────> (N) maintenance_items
frequencies (1) ─────────────> (N) maintenance_items
```

---

## Access Control Flow

1. **User authenticates** via Supabase Auth
2. **Check subscription** from `subscriptions` table
3. **Get plan details** from `subscription_plans`
4. **Check app access** from `app_access` table
5. **Apply user overrides** from `user_app_permissions` (if any)
6. **Enforce limits** in application logic

### Example Access Check:
```sql
-- Check if user can access house-planner
SELECT 
    s.status,
    sp.name as plan_name,
    aa.feature_limits,
    uap.feature_overrides
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
LEFT JOIN app_access aa ON sp.id = aa.plan_id AND aa.app_name = 'house-planner'
LEFT JOIN user_app_permissions uap ON s.user_id = uap.user_id AND uap.app_name = 'house-planner'
WHERE s.user_id = auth.uid()
  AND s.status = 'active';
```

---

## Row Level Security (RLS)

All tables use RLS to ensure data isolation:

- **Subscription Plans**: Public read for active plans
- **Subscriptions**: Users see only their own
- **App Access**: Public read (plan features are public)
- **User Permissions**: Users see only their own
- **App Data** (rooms, habits, etc.): Users see only their own

**Standard Policy Pattern:**
```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

---

## Cascade Rules

### User Deletion
Cascades to all user data:
- subscriptions
- user_app_permissions
- rooms → maintenance_items
- frequencies
- maintenance_items

### Plan Deletion
- app_access records deleted
- Subscriptions remain (orphaned plans should be handled by application)

### Room Deletion
- Associated maintenance_items cascade deleted

### Frequency Deletion
- maintenance_items.frequency_id set to NULL

---

## Triggers

Auto-update `updated_at` timestamps on:
- subscription_plans
- subscriptions
- user_app_permissions
- rooms
- maintenance_items

---

## Migration Path

### From house-planner/database
1. ✅ Schema moved to `shared/database/`
2. ✅ Subscription tables added
3. ⏳ Update app connection strings to shared database
4. ⏳ Implement subscription checks in frontend
5. ⏳ Add subscription management UI

### For habit-tracker
1. ⏳ Define habit-related tables
2. ⏳ Add to shared schema
3. ⏳ Update seed data in app_access

### For personal-website
1. ⏳ Assess if database needed
2. ⏳ Define tables if required
3. ⏳ Update seed data in app_access

---

## Future Enhancements

### Subscription System
- Payment integration (Stripe/PayPal)
- Trial periods with automatic conversion
- Usage analytics and quota warnings
- Family/team plans
- Custom enterprise plans

### House Planner
- Task history tracking
- Shared households (multi-user)
- Template libraries
- Attachments and photos
- Smart scheduling recommendations

### Cross-App Features
- Unified dashboard
- Cross-app notifications
- Activity feed
- User preferences/settings table
- App usage analytics

---

## Query Examples

### Check User's Current Access
```sql
-- Get all apps user has access to
SELECT 
    aa.app_name,
    aa.feature_limits,
    COALESCE(uap.feature_overrides, aa.feature_limits) as effective_limits
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
JOIN app_access aa ON sp.id = aa.plan_id
LEFT JOIN user_app_permissions uap ON s.user_id = uap.user_id AND aa.app_name = uap.app_name
WHERE s.user_id = auth.uid()
  AND s.status = 'active'
  AND (uap.has_access IS NULL OR uap.has_access = true);
```

### Get User's Maintenance Items with Limits
```sql
-- Get count and compare to subscription limit
WITH limits AS (
    SELECT 
        (aa.feature_limits->>'max_items')::int as max_items
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    JOIN app_access aa ON sp.id = aa.plan_id
    WHERE s.user_id = auth.uid() 
      AND aa.app_name = 'house-planner'
)
SELECT 
    COUNT(*) as current_items,
    l.max_items,
    (COUNT(*) < l.max_items OR l.max_items = -1) as can_add_more
FROM maintenance_items mi, limits l
WHERE mi.user_id = auth.uid()
GROUP BY l.max_items;
```

### Upgrade Subscription
```sql
-- Update user's subscription plan
UPDATE subscriptions
SET plan_id = (SELECT id FROM subscription_plans WHERE name = 'premium'),
    updated_at = NOW()
WHERE user_id = auth.uid();
```

---

## Development Notes

- Use `gen_random_uuid()` for UUID generation
- All timestamps use `TIMESTAMP WITH TIME ZONE`
- JSONB fields allow flexible feature definitions
- Subscription checks should be cached in application layer
- Consider adding usage tracking for analytics
