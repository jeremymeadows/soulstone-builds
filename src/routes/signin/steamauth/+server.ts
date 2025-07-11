import { RelyingParty } from 'openid';

import { STEAM_KEY } from '$env/static/private';
import { db } from '$lib/server/database/database.js';

async function get_profile(steamid: string): Promise<string> {
    const res = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_KEY}&steamids=${steamid}`);
    if (!res.ok) {
        return Promise.reject(new Error(`Failed to fetch Steam profile: ${res.status} ${res.statusText}`));
    }
    return (await res.json()).response.players[0].personaname;
};

export async function GET({ url, cookies }) {
    const client = new RelyingParty(
        url.origin + '/signin/steamauth',
        url.origin,
        true,
        false,
        []
    );

    return new Promise((resolve) => {
        if (url.searchParams.has('openid.mode') && url.searchParams.get('openid.mode') === 'id_res') {
            client.verifyAssertion(url.href, async (err, result) => {
                if (err || !result || !result.authenticated) {
                    resolve(new Response('Login failed', { status: 401 }));
                } else {
                    let steamid = result.claimedIdentifier!.match(/\d+$/)![0];
                    db.signin(steamid, (await get_profile(steamid)) ?? undefined).match({
                        ok: ({session_id, expires}: { session_id: string, expires: Date }) => {
                            cookies.set('session', session_id, { path: '/', expires });
                            resolve(Response.redirect('/signin/steamauth/return', 303))
                        },
                        err: (err: Error) => {
                            console.error(err.message);
                            resolve(new Response("Failed to create session", { status: 500 }))
                        }
                    });
                }
            });
        } else {
            client.authenticate('https://steamcommunity.com/openid', false, (err, authUrl) => {
                if (err || !authUrl) {
                    resolve(new Response('Authentication failed', { status: 500 }));
                } else {
                    resolve(Response.redirect(authUrl));
                }
            });
        }
    });
}
