/*
  # Add updated_at column to users table

  1. Changes
    - Add updated_at column to users table
    - Set default value to now()
    - Update existing rows
*/

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.users
    ADD COLUMN updated_at timestamptz DEFAULT timezone('utc'::text, now());

    -- Update existing rows to have updated_at = created_at
    UPDATE public.users
    SET updated_at = created_at
    WHERE updated_at IS NULL;

    -- Make updated_at NOT NULL after setting initial values
    ALTER TABLE public.users
    ALTER COLUMN updated_at SET NOT NULL;
  END IF;
END $$;