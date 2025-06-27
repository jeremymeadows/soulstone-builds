import { db } from "$lib/server/database";
import { redirect, type Load } from "@sveltejs/kit";

export const load: Load = async ({ cookies }: any) => {
    db.signout(cookies.get("session"));
    cookies.delete("session", { path: "/" });
    redirect(303, "/signin/steamauth/return");
}