/*
  # Fix infinite recursion in RLS policies

  1. Problem
    - The "Admins can read all profiles" policy causes infinite recursion
    - It queries the profiles table from within a policy applied to the profiles table
    - This creates a circular dependency when checking admin permissions

  2. Solution
    - Remove the problematic admin policy that causes recursion
    - Keep the simple policies that work correctly:
      - Users can read their own profile
      - Users can update their own profile
    - Admin functionality can be handled at the application level instead

  3. Changes
    - Drop the recursive admin policy
    - Keep the working user policies
*/

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- The remaining policies are safe and don't cause recursion:
-- 1. "Users can read own profile" - uses auth.uid() = id (no table query)
-- 2. "Users can update own profile" - uses auth.uid() = id (no table query)

-- If admin functionality is needed, it should be handled at the application level
-- or through a different approach that doesn't query the same table from within its policy