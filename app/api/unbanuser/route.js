import { decrypt, GetIsAdmin } from "@/app/lib/session";
import { cookies } from "next/headers";
import { RemoveFromBanList } from "@/app/lib/banlist";
const dotenv = require('dotenv');
dotenv.config();

export async function POST(req) {
    const incomingbody = await req.json();
    if(incomingbody.email == null){
        return new Response("missing info", {status: 400});
    }
    const session = (await cookies()).get("session")?.value;
    if (!session) {
        return new Response("No session", { status: 401 });
    }
    const payload = await decrypt(session);
    if (!payload) {
        return new Response("Bad session", { status: 400 });
    }
    if(await GetIsAdmin(session) != true){
        return new Response("not enough rights", {status: 403});
    }
    if(await RemoveFromBanList(incomingbody.email)){
        return new Response("unbanned successfully", {status: 200});
    } else {
        return new Response("failed to unban", {status: 500});
    }
}