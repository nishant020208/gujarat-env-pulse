
-- Lock function search_path and revoke unnecessary EXECUTE
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.touch_updated_at() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
-- authenticated retains EXECUTE on has_role (needed by RLS policies)
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
