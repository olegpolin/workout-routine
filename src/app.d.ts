import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
			profile: {
				username: string;
				full_name: string | null;
				avatar_url: string | null;
			} | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
