-- ============================================
-- Shared Database Schema for Websites Platform
-- ============================================
-- This schema supports multiple applications:
-- - House Planner
-- - Habit Tracker
-- - Personal Website
-- With unified subscription and user management
-- ============================================

-- Note: auth.users table is managed by Supabase Authentication
-- This schema extends it with subscription and app-specific tables

-- ============================================
-- SUBSCRIPTION MANAGEMENT TABLES
-- ============================================

-- Subscription Plans (Free, Basic, Premium, etc.)
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10, 2),
    price_yearly DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    features JSONB, -- Flexible feature list
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(20) DEFAULT 'active', -- active, canceled, expired, trial
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id) -- One active subscription per user
);

-- App Access Configuration (which apps are included in each plan)
CREATE TABLE app_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
    app_name VARCHAR(50) NOT NULL, -- 'house-planner', 'habit-tracker', 'personal-website'
    feature_limits JSONB, -- App-specific feature limits
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-specific app permissions (for granular control)
CREATE TABLE user_app_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    app_name VARCHAR(50) NOT NULL,
    has_access BOOLEAN DEFAULT false,
    feature_overrides JSONB, -- Custom feature limits for this user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, app_name)
);

-- ============================================
-- HOUSE PLANNER TABLES
-- ============================================

-- Rooms in a household
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance frequency definitions
CREATE TABLE frequencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    days INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance items/tasks
CREATE TABLE maintenance_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    frequency_id UUID REFERENCES frequencies(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    last_completed TIMESTAMP WITH TIME ZONE,
    next_due TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HABIT TRACKER TABLES (Placeholder)
-- ============================================
-- To be implemented when habit tracker is developed

-- ============================================
-- PERSONAL WEBSITE TABLES (Placeholder)
-- ============================================
-- To be implemented if needed

-- ============================================
-- INDEXES
-- ============================================

-- Subscription indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_app_access_plan_id ON app_access(plan_id);
CREATE INDEX idx_user_app_permissions_user_id ON user_app_permissions(user_id);

-- House planner indexes
CREATE INDEX idx_rooms_user_id ON rooms(user_id);
CREATE INDEX idx_frequencies_user_id ON frequencies(user_id);
CREATE INDEX idx_maintenance_items_user_id ON maintenance_items(user_id);
CREATE INDEX idx_maintenance_items_room_id ON maintenance_items(room_id);
CREATE INDEX idx_maintenance_items_status ON maintenance_items(status);
CREATE INDEX idx_maintenance_items_next_due ON maintenance_items(next_due);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_app_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE frequencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_items ENABLE ROW LEVEL SECURITY;

-- Subscription Plans (public read, admin write)
CREATE POLICY "subscription_plans_select" ON subscription_plans FOR SELECT USING (is_active = true);

-- Subscriptions (users can only see their own)
CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- App Access (public read for active plans)
CREATE POLICY "app_access_select" ON app_access FOR SELECT USING (
    EXISTS (SELECT 1 FROM subscription_plans WHERE id = plan_id AND is_active = true)
);

-- User App Permissions
CREATE POLICY "user_app_permissions_select" ON user_app_permissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_app_permissions_insert" ON user_app_permissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_app_permissions_update" ON user_app_permissions FOR UPDATE USING (auth.uid() = user_id);

-- Rooms
CREATE POLICY "rooms_select" ON rooms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "rooms_insert" ON rooms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rooms_update" ON rooms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "rooms_delete" ON rooms FOR DELETE USING (auth.uid() = user_id);

-- Frequencies
CREATE POLICY "frequencies_select" ON frequencies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "frequencies_insert" ON frequencies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "frequencies_update" ON frequencies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "frequencies_delete" ON frequencies FOR DELETE USING (auth.uid() = user_id);

-- Maintenance Items
CREATE POLICY "maintenance_items_select" ON maintenance_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "maintenance_items_insert" ON maintenance_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "maintenance_items_update" ON maintenance_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "maintenance_items_delete" ON maintenance_items FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_app_permissions_updated_at BEFORE UPDATE ON user_app_permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_items_updated_at BEFORE UPDATE ON maintenance_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Example Plans)
-- ============================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, features) VALUES
('free', 'Free', 'Basic access with limited features', 0.00, 0.00, '{"max_rooms": 3, "max_habits": 5, "max_maintenance_items": 10}'::jsonb),
('basic', 'Basic', 'Access to all apps with standard features', 4.99, 49.99, '{"max_rooms": 10, "max_habits": 20, "max_maintenance_items": 50}'::jsonb),
('premium', 'Premium', 'Unlimited access to all features', 9.99, 99.99, '{"max_rooms": -1, "max_habits": -1, "max_maintenance_items": -1, "priority_support": true}'::jsonb);

-- Define which apps are included in each plan
INSERT INTO app_access (plan_id, app_name, feature_limits) VALUES
-- Free plan: limited access to all apps
((SELECT id FROM subscription_plans WHERE name = 'free'), 'house-planner', '{"max_rooms": 3, "max_items": 10}'::jsonb),
((SELECT id FROM subscription_plans WHERE name = 'free'), 'habit-tracker', '{"max_habits": 5}'::jsonb),
((SELECT id FROM subscription_plans WHERE name = 'free'), 'personal-website', '{"basic_features_only": true}'::jsonb),

-- Basic plan: full access to all apps
((SELECT id FROM subscription_plans WHERE name = 'basic'), 'house-planner', '{"max_rooms": 10, "max_items": 50}'::jsonb),
((SELECT id FROM subscription_plans WHERE name = 'basic'), 'habit-tracker', '{"max_habits": 20}'::jsonb),
((SELECT id FROM subscription_plans WHERE name = 'basic'), 'personal-website', '{"all_features": true}'::jsonb),

-- Premium plan: unlimited access
((SELECT id FROM subscription_plans WHERE name = 'premium'), 'house-planner', '{"unlimited": true}'::jsonb),
((SELECT id FROM subscription_plans WHERE name = 'premium'), 'habit-tracker', '{"unlimited": true}'::jsonb),
((SELECT id FROM subscription_plans WHERE name = 'premium'), 'personal-website', '{"unlimited": true}'::jsonb);
