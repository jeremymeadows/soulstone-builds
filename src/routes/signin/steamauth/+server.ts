import { error, redirect } from '@sveltejs/kit';

import { RelyingParty } from 'openid';

import { STEAM_KEY } from '$env/static/private';
import { db } from '$lib/server/database/database.js';

const fetchSteamProfile = async (steamid: string) => {
    // const res = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_KEY}&steamids=${steamid}`);
    const res = { ok: false, status: 299, statusText: "test", json: () => { return { response: { players: [null] } } } };
    console.log(res)
    if (!res.ok) {
        return Promise.reject(new Error(`Failed to fetch Steam profile: ${res.status} ${res.statusText}`));
    }
    let data = await res.json();
    let profile = data.response.players[0];
    if (!profile) {
        return Promise.reject(new Error('Steam profile not found'));
    }
    return Object.fromEntries(["steamid", "personaname", "avatar", "avatarfull", "realname"].map(key => [key, profile[key]]));
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
            client.verifyAssertion(url.href, (err, result) => {
                if (err || !result || !result.authenticated) {
                    resolve(new Response('Login failed', { status: 401 }));
                } else {
                    let steamid = result.claimedIdentifier?.match(/\d+$/)![0];
                    let profile = { steamid: steamid, personaname: "test" };
                    

                    db.signin(steamid, profile).match({
                        ok: (session_id: string) => {
                            cookies.set('session', session_id, { path: '/' });
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

let example = {
    steamid: "76561198345569146",
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: "Jer",
    profileurl: "https://steamcommunity.com/profiles/76561198345569146/",
    avatar: "https://avatars.steamstatic.com/e20af94a9b8ed08f48298d9df8f09e27ff0de63f.jpg",
    avatarmedium: "https://avatars.steamstatic.com/e20af94a9b8ed08f48298d9df8f09e27ff0de63f_medium.jpg",
    avatarfull: "https://avatars.steamstatic.com/e20af94a9b8ed08f48298d9df8f09e27ff0de63f_full.jpg",
    avatarhash: "e20af94a9b8ed08f48298d9df8f09e27ff0de63f",
    lastlogoff: 1740953594,
    personastate: 0,
    realname: "Jeremy Meadows",
    primaryclanid: "103582791429521408",
    timecreated: 1479870765,
    personastateflags: 0,
    loccountrycode: "IE",
}