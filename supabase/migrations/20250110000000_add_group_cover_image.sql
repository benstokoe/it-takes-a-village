-- Add cover image URL column to groups table
-- This column will store the public URL of the group's cover image from Supabase storage

-- Only add the column if the table exists and the column doesn't already exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'groups' AND table_schema = 'public') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'cover_image_url' AND table_schema = 'public') THEN
            ALTER TABLE public.groups ADD COLUMN cover_image_url TEXT;
            COMMENT ON COLUMN public.groups.cover_image_url IS 'Public URL of the group''s cover image stored in Supabase storage';
        END IF;
    END IF;
END
$$;
