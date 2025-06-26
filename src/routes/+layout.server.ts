import type { Load } from '@sveltejs/kit';

import { user } from '$lib/stores';
import { db } from '$lib/server/database';

export const prerender = true;

// export const load: Load = async ({ cookies }: any) => {
//     let session_id = cookies.get('session');
//     if (session_id) {
//         db.get_user(session_id).match({
//             ok: (profile) => {
//                 user.set(profile);
//                 console.log('profile:', profile)
//                 return { profile };
//             },
//             err: () => {
//                 cookies.delete('session', { path: '/' });
//             }
//         });
//     }
//     return { profile: null }
// };