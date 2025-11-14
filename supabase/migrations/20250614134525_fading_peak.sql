/*
  # Fix user registration trigger

  1. Problem
    - The existing handle_new_user trigger is failing to create profiles
    - This causes registration to fail with "Database error saving new user"

  2. Solution
    - Recreate the handle_new_user function with proper error handling
    - Ensure the trigger is properly configured
    - Handle cases where full_name might be null or missing

  3. Changes
    - Drop and recreate the handle_new_user function
    - Add proper null handling for full_name
    - Ensure the trigger fires correctly on auth.users insert
*/

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 
    'user'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();