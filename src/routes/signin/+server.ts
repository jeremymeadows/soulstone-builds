import { db } from "$lib/server/database";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// export const POST: RequestHandler = async ({ cookies, request }) => {
//     const data = await request.formData();
//     const email = data.get("username") as string;
//     const password = data.get("password") as string;

//     const session_id = await db.signup(email, password);
//     console.log(session_id)

//     if (session_id) {
//         cookies.set("session_id", session_id, { path: '/' });
//         return redirect(303, '/');
//     } else {
//         return error(400, { message: "Failed to sign up", });
//     }
// }