CREATE TABLE prospects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  logo_data_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#1e40af',
  secondary_color TEXT NOT NULL DEFAULT '#60a5fa',
  industry TEXT NOT NULL DEFAULT 'Retail',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_prospects" ON prospects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_prospects" ON prospects FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_prospects" ON prospects FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_prospects" ON prospects FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE mockup_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  product_category TEXT NOT NULL,
  selected_templates TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE mockup_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_mockup_sessions" ON mockup_sessions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_mockup_sessions" ON mockup_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_mockup_sessions" ON mockup_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_mockup_sessions" ON mockup_sessions FOR DELETE TO anon, authenticated USING (true);
