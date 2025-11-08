import type { PageServerLoad, Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod4 } from "sveltekit-superforms/adapters";
import { accountFormSchema } from './account-form-schema';
import { signoutFormSchema } from './signout-form-schema';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
  const { session } = await safeGetSession();
  if (!session) {
    redirect(303, '/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name')
    .eq('id', session.user.id)
    .single();

  return {
    accountForm: await superValidate(profile, zod4(accountFormSchema)),
    signoutForm: await superValidate(zod4(signoutFormSchema)),
    session,
  };
};

export const actions: Actions = {
  update: async (event) => {
    const accountForm = await superValidate(event, zod4(accountFormSchema));
    if (!accountForm.valid) {
      return fail(400, {
        accountForm,
      });
    }

    const { locals: { supabase, safeGetSession } } = event;
    const { session } = await safeGetSession();
    if (!session) {
      error(500);
    }

    const { error: updateError } = await supabase.from('profiles').upsert({
      id: session.user.id,
      full_name: accountForm.data.full_name,
      username: accountForm.data.username,
      updated_at: new Date(),
    });

    if (updateError) {
      if (updateError.code === '23505') {
        return setError(accountForm, 'username', 'Username is already taken');
      }
      error(500);
    }

    return {
      accountForm,
    };
  },

  signout: async (event) => {
    const signoutForm = await superValidate(event, zod4(signoutFormSchema));
    if (!signoutForm.valid) {
      return fail(400, {
        signoutForm,
      });
    }

    const { locals: { supabase, safeGetSession } } = event;
    const { session } = await safeGetSession();
    if (!session) {
      error(500);
    }

    const { error: signoutError } = await supabase.auth.signOut();
    if (signoutError) {
      error(500);
    }
    redirect(303, '/login');

    return {
      signoutForm,
    };
  }
};
