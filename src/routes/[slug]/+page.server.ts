import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('username', params.slug)
    .single();

  if (!userProfile) {
    error(404, 'Not Found');
  }

  return {
    userProfile
  };
};
