import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { supabase, safeGetSession }, cookies }) => {
  const { session } = await safeGetSession();

  let profile = null;
  if (session) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url')
      .eq('id', session.user.id)
      .single();
    profile = profileData;
  }

  return {
    session,
    profile,
    cookies: cookies.getAll(),
  };
}
