-- Create a function to get public posts with optional category filter
CREATE OR REPLACE FUNCTION public.get_public_posts(
  p_category text DEFAULT NULL
)
RETURNS SETOF posts
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * 
  FROM posts
  WHERE p_category IS NULL OR category = p_category
  ORDER BY created_at DESC;
$$;

-- Grant execute permission to all users
GRANT EXECUTE ON FUNCTION public.get_public_posts(text) TO anon, authenticated;
