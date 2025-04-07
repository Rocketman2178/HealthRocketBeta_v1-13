/*
  # Update Boost FP Values Table

  1. Changes
    - Remove old boost entries
    - Add new boost entries with updated IDs and FP values
    - Ensure all categories are properly represented
    - Match the new boost structure from the application

  2. Security
    - Maintain existing RLS policies
*/

-- First, delete all existing boost entries to avoid duplicates
DELETE FROM public.boost_fp_values;

-- Insert new Sleep boost values
INSERT INTO public.boost_fp_values (boost_id, fp_value, category) VALUES
  ('sleep-t1-1', 1, 'Sleep'),
  ('sleep-t1-2', 2, 'Sleep'),
  ('sleep-t1-3', 3, 'Sleep'),
  ('sleep-t1-4', 4, 'Sleep'),
  ('sleep-t1-5', 5, 'Sleep'),
  ('sleep-t1-6', 6, 'Sleep'),
  ('sleep-t2-1', 7, 'Sleep'),
  ('sleep-t2-2', 8, 'Sleep'),
  ('sleep-t2-3', 9, 'Sleep');

-- Insert new Mindset boost values
INSERT INTO public.boost_fp_values (boost_id, fp_value, category) VALUES
  ('mindset-t1-1', 1, 'Mindset'),
  ('mindset-t1-2', 2, 'Mindset'),
  ('mindset-t1-3', 3, 'Mindset'),
  ('mindset-t1-4', 4, 'Mindset'),
  ('mindset-t1-5', 5, 'Mindset'),
  ('mindset-t1-6', 6, 'Mindset'),
  ('mindset-t2-1', 7, 'Mindset'),
  ('mindset-t2-2', 8, 'Mindset'),
  ('mindset-t2-3', 9, 'Mindset');

-- Insert new Exercise boost values
INSERT INTO public.boost_fp_values (boost_id, fp_value, category) VALUES
  ('exercise-t1-1', 1, 'Exercise'),
  ('exercise-t1-2', 2, 'Exercise'),
  ('exercise-t1-3', 3, 'Exercise'),
  ('exercise-t1-4', 4, 'Exercise'),
  ('exercise-t1-5', 5, 'Exercise'),
  ('exercise-t1-6', 6, 'Exercise'),
  ('exercise-t2-1', 7, 'Exercise'),
  ('exercise-t2-2', 8, 'Exercise'),
  ('exercise-t2-3', 9, 'Exercise');

-- Insert new Nutrition boost values
INSERT INTO public.boost_fp_values (boost_id, fp_value, category) VALUES
  ('nutrition-t1-1', 1, 'Nutrition'),
  ('nutrition-t1-2', 2, 'Nutrition'),
  ('nutrition-t1-3', 3, 'Nutrition'),
  ('nutrition-t1-4', 4, 'Nutrition'),
  ('nutrition-t1-5', 5, 'Nutrition'),
  ('nutrition-t1-6', 6, 'Nutrition'),
  ('nutrition-t2-1', 7, 'Nutrition'),
  ('nutrition-t2-2', 8, 'Nutrition'),
  ('nutrition-t2-3', 9, 'Nutrition');

-- Insert new Biohacking boost values
INSERT INTO public.boost_fp_values (boost_id, fp_value, category) VALUES
  ('biohacking-t1-1', 1, 'Biohacking'),
  ('biohacking-t1-2', 2, 'Biohacking'),
  ('biohacking-t1-3', 3, 'Biohacking'),
  ('biohacking-t1-4', 4, 'Biohacking'),
  ('biohacking-t1-5', 5, 'Biohacking'),
  ('biohacking-t1-6', 6, 'Biohacking'),
  ('biohacking-t2-1', 7, 'Biohacking'),
  ('biohacking-t2-2', 8, 'Biohacking'),
  ('biohacking-t2-3', 9, 'Biohacking');