/*
  # Book Recommendation System Database Schema

  1. New Tables
    - `admins` - Admin users with role-based access
    - `categories` - Book categories (fairy-tale, educational, etc.)
    - `age_groups` - Age group classifications
    - `books` - Main books table with all book information
    - `development_areas` - Child development areas
    - `reading_tips` - Reading advice and tips
    - `resources` - Downloadable resources and materials
    
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access based on roles
    - Super admin has full access, regular admin has limited access
    
  3. Data Types
    - UUID primary keys with auto-generation
    - Proper indexing for performance
    - JSON fields for arrays (benefits, tips, etc.)
*/

-- Create custom types
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin');
CREATE TYPE resource_type AS ENUM ('template', 'guide', 'audio', 'video', 'list', 'image');

-- Create tables
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role admin_role NOT NULL DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS age_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text UNIQUE NOT NULL,
  label text NOT NULL,
  min_age integer,
  max_age integer,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  age text NOT NULL,
  category text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  image text,
  description text,
  benefits jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admins(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS development_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  benefits jsonb DEFAULT '[]'::jsonb,
  color text DEFAULT 'primary',
  icon text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admins(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reading_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  tips jsonb DEFAULT '[]'::jsonb,
  icon text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admins(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type resource_type NOT NULL,
  description text,
  download_url text,
  category text,
  file_size text,
  is_active boolean DEFAULT true,
  download_count integer DEFAULT 0,
  created_by uuid REFERENCES admins(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_age ON books(age);
CREATE INDEX idx_books_rating ON books(rating);
CREATE INDEX idx_books_is_active ON books(is_active);
CREATE INDEX idx_books_is_featured ON books(is_featured);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for admins table
CREATE POLICY "Admins can read own profile"
  ON admins
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Super admins can read all admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND role = 'super_admin'
      AND is_active = true
    )
  );

CREATE POLICY "Super admins can insert admins"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND role = 'super_admin'
      AND is_active = true
    )
  );

CREATE POLICY "Super admins can update admins"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND role = 'super_admin'
      AND is_active = true
    )
  );

-- Create RLS Policies for other tables (accessible by all authenticated admins)
CREATE POLICY "Authenticated admins can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can read age_groups"
  ON age_groups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can manage age_groups"
  ON age_groups
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can read books"
  ON books
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can manage books"
  ON books
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can read development_areas"
  ON development_areas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can manage development_areas"
  ON development_areas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can read reading_tips"
  ON reading_tips
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can manage reading_tips"
  ON reading_tips
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can read resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can manage resources"
  ON resources
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

-- Create public policies for frontend to read published content
CREATE POLICY "Public can read active categories"
  ON categories
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Public can read active age_groups"
  ON age_groups
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Public can read active books"
  ON books
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Public can read active development_areas"
  ON development_areas
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Public can read active reading_tips"
  ON reading_tips
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Public can read active resources"
  ON resources
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_age_groups_updated_at BEFORE UPDATE ON age_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_development_areas_updated_at BEFORE UPDATE ON development_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reading_tips_updated_at BEFORE UPDATE ON reading_tips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();