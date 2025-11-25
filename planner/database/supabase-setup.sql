-- ================================================
-- SUPABASE DATABASE SCHEMA
-- Household Maintenance App
-- ================================================

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.frequencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.maintenance_items ENABLE ROW LEVEL SECURITY;

-- ================================================
-- TABLES
-- ================================================

-- Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Frequencies Table
CREATE TABLE IF NOT EXISTS public.frequencies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(50) NOT NULL,
    days INTEGER NOT NULL, -- Number of days between maintenance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance Items Table
CREATE TABLE IF NOT EXISTS public.maintenance_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    frequency_id UUID REFERENCES public.frequencies(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    last_completed TIMESTAMP WITH TIME ZONE,
    next_due TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, overdue
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- INDEXES FOR BETTER QUERY PERFORMANCE
-- ================================================

CREATE INDEX IF NOT EXISTS idx_rooms_user_id ON public.rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_frequencies_user_id ON public.frequencies(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_items_user_id ON public.maintenance_items(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_items_room_id ON public.maintenance_items(room_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_items_status ON public.maintenance_items(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_items_next_due ON public.maintenance_items(next_due);

-- ================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================

-- Rooms policies
CREATE POLICY "Users can view their own rooms"
    ON public.rooms FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rooms"
    ON public.rooms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rooms"
    ON public.rooms FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rooms"
    ON public.rooms FOR DELETE
    USING (auth.uid() = user_id);

-- Frequencies policies
CREATE POLICY "Users can view their own frequencies"
    ON public.frequencies FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own frequencies"
    ON public.frequencies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own frequencies"
    ON public.frequencies FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own frequencies"
    ON public.frequencies FOR DELETE
    USING (auth.uid() = user_id);

-- Maintenance Items policies
CREATE POLICY "Users can view their own maintenance items"
    ON public.maintenance_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maintenance items"
    ON public.maintenance_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maintenance items"
    ON public.maintenance_items FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maintenance items"
    ON public.maintenance_items FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================
-- SAMPLE DATA (Optional - for testing)
-- ================================================

-- Insert default frequencies (run this after user signs up)
-- INSERT INTO public.frequencies (user_id, name, days) VALUES
--     (auth.uid(), 'Daily', 1),
--     (auth.uid(), 'Weekly', 7),
--     (auth.uid(), 'Bi-weekly', 14),
--     (auth.uid(), 'Monthly', 30),
--     (auth.uid(), 'Quarterly', 90),
--     (auth.uid(), 'Bi-annually', 180),
--     (auth.uid(), 'Annually', 365);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON public.rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_items_updated_at
    BEFORE UPDATE ON public.maintenance_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
