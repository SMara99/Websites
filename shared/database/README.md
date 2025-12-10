# Shared Database for Websites Platform

## Overview
This directory contains the unified database schema for all applications in the Websites platform. A single database supports multiple applications with subscription-based access control.

---

## Applications Supported

1. **House Planner** - Household maintenance tracking
2. **Habit Tracker** - Personal habit management (to be implemented)
3. **Personal Website** - Portfolio and schedule management (optional)

---

## Files

### `supabase-setup.sql`
Complete PostgreSQL schema including:
- Subscription management tables
- User access control tables
- House Planner tables (rooms, frequencies, maintenance_items)
- Placeholder tables for other apps
- Row Level Security (RLS) policies
- Indexes and triggers
- Seed data for default subscription plans

**Usage**: Run this file in your Supabase SQL editor to set up the entire database.

---

## Database Structure

### Core Subscription Tables
- `subscription_plans` - Available plans (Free, Basic, Premium)
- `subscriptions` - User subscription status
- `app_access` - Which apps are included in each plan
- `user_app_permissions` - User-specific access overrides

### House Planner Tables
- `rooms` - User's household rooms
- `frequencies` - Maintenance frequency definitions
- `maintenance_items` - Household maintenance tasks

### Future Tables
- Habit tracker tables (to be added)
- Personal website tables (if needed)

---

## Setup Instructions

### Prerequisites
- Supabase project created
- Database access (SQL editor)

### Installation Steps

1. **Navigate to Supabase Dashboard**
   - Go to your project's SQL Editor

2. **Run Setup Script**
   ```sql
   -- Copy and paste contents of supabase-setup.sql
   -- Execute the script
   ```

3. **Verify Installation**
   ```sql
   -- Check if tables were created
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

4. **Verify Seed Data**
   ```sql
   -- Check subscription plans
   SELECT * FROM subscription_plans;
   
   -- Check app access configuration
   SELECT * FROM app_access;
   ```

---

## Subscription Plans

### Default Plans Included

| Plan | Monthly | Yearly | Description |
|------|---------|--------|-------------|
| Free | $0 | $0 | Limited access to all apps |
| Basic | $4.99 | $49.99 | Full features with standard limits |
| Premium | $9.99 | $99.99 | Unlimited access to everything |

See `../docs/subscription-tiers.md` for detailed feature comparison.

---

## Connection Configuration

### Environment Variables
Each application should use these connection strings:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key (server-side only)
```

### Application Updates Required

1. **house-planner/**
   - Update connection to point to shared database
   - Remove local `database/` folder (after migration)
   - Update docs to reference shared schema

2. **habit-tracker/**
   - Add database connection
   - Use shared authentication
   - Implement subscription checks

3. **personal-website/**
   - Add database connection if needed
   - Use shared authentication
   - Implement subscription checks

---

## Security Features

### Row Level Security (RLS)
- All tables protected by RLS policies
- Users can only access their own data
- Automatic enforcement at database level

### Authentication
- Handled by Supabase Auth (`auth.users`)
- JWT tokens for API access
- Automatic user ID tracking

### Data Isolation
- Each user's data completely isolated
- No cross-user data access
- Subscription limits enforced at app level

---

## Migration Guide

### From house-planner/database

1. **Backup Existing Data** (if any)
   ```sql
   -- Export existing data if production
   ```

2. **Update Connection Strings**
   - Point to shared database
   - Update environment variables

3. **Remove Old Schema**
   - Delete `house-planner/database/` folder
   - Update `house-planner/README.md`

4. **Test Access**
   - Verify RLS policies work
   - Test CRUD operations
   - Verify subscription checks

---

## Development Workflow

### Local Development
1. Create development Supabase project
2. Run `supabase-setup.sql` in dev project
3. Use dev connection strings in applications
4. Test subscription logic

### Adding New Apps
1. Define tables in schema
2. Add app to `app_access` seed data
3. Update documentation
4. Implement subscription checks in app

### Schema Changes
1. Write migration SQL
2. Test in development
3. Update `supabase-setup.sql`
4. Update documentation
5. Deploy to production

---

## Monitoring & Maintenance

### Check Subscription Status
```sql
-- Active subscriptions
SELECT u.email, sp.name, s.status, s.expires_at
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.status = 'active';
```

### Check Usage Stats
```sql
-- Rooms per user
SELECT user_id, COUNT(*) as room_count
FROM rooms
GROUP BY user_id;

-- Maintenance items per user
SELECT user_id, COUNT(*) as item_count
FROM maintenance_items
GROUP BY user_id;
```

### Expired Subscriptions
```sql
-- Find expired subscriptions
SELECT u.email, s.expires_at
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.expires_at < NOW()
  AND s.status = 'active';
```

---

## Troubleshooting

### Issue: RLS Blocking Access
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify user context
SELECT auth.uid(); -- Should return user's UUID
```

### Issue: Subscription Not Found
```sql
-- Check if user has subscription
SELECT * FROM subscriptions WHERE user_id = auth.uid();

-- Create default free subscription if missing
INSERT INTO subscriptions (user_id, plan_id)
VALUES (
  auth.uid(),
  (SELECT id FROM subscription_plans WHERE name = 'free')
);
```

### Issue: Feature Limits Not Working
```sql
-- Check app access configuration
SELECT sp.name, aa.app_name, aa.feature_limits
FROM subscription_plans sp
JOIN app_access aa ON sp.id = aa.plan_id
ORDER BY sp.name, aa.app_name;
```

---

## Best Practices

1. **Always Use Prepared Statements** - Prevent SQL injection
2. **Cache Subscription Data** - Reduce database queries
3. **Enforce Limits Client-Side** - Better UX before server rejection
4. **Log Subscription Changes** - Audit trail for billing
5. **Handle Edge Cases** - Expired subscriptions, downgrades, etc.
6. **Test RLS Policies** - Verify users can't access others' data

---

## Future Enhancements

### Planned Features
- [ ] Payment integration (Stripe)
- [ ] Usage analytics dashboard
- [ ] Automated expiration handling
- [ ] Family/team subscriptions
- [ ] Custom enterprise plans
- [ ] Multi-tenancy support

### Schema Additions
- [ ] Habit tracker tables
- [ ] Payment history table
- [ ] Usage statistics table
- [ ] Notification preferences
- [ ] Audit log table

---

## Support

For questions or issues:
1. Check documentation in `../docs/`
2. Review SQL comments in `supabase-setup.sql`
3. Test queries in Supabase SQL editor
4. Contact platform administrator

---

## Related Documentation

- [Database Schema](../docs/database-schema.md) - Detailed table documentation
- [Subscription Tiers](../docs/subscription-tiers.md) - Plan features and pricing
- [House Planner Docs](../../house-planner/docs/) - App-specific documentation
