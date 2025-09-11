import NextResponse from "next/server";
import { CosmosClient, Items } from "@azure/cosmos";
import { decrypt, GetIsAdmin, refreshSession } from "@/app/lib/session";
import { cookies } from "next/headers";
const sqlstring = require('sqlstring');
const dotenv = require('dotenv');
dotenv.config();

const endpoint = process.env.DB_ENDPOINT;
const key = process.env.DB_KEY;

const dbclient = new CosmosClient({
    endpoint,
    key
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const { container } = await database.containers.createIfNotExists({ id: process.env.USERCONTAINER_ID });

export async function POST(req) {
    const incomingurl = new URL(req.url);
    const session = (await cookies()).get("session")?.value;
    if (!session) {
        return new Response("No session", { status: 401 });
    }
    const isAdmin = GetIsAdmin(session);
    const payload = await decrypt(session);
    if (!payload) {
        return new Response("Bad session", { status: 400 });
    }
    if (isAdmin && incomingurl.searchParams.has("id")) {
        const user = (await container.item(incomingurl.searchParams.get("id"), incomingurl.searchParams.get("id")).read()).resource;
        if (user == null) {
            return new Response("user not found", { status: 404 });
        }
        const data = await req.json();
        if (!data.role || !data.experiencelevel || !data.bracket || !data.email || !data.name || !data.pfp || !data.permissions) {
            return new Response("missing data", { status: 400 });
        }
        user.role = data.role;
        user.experiencelevel = data.experiencelevel;
        user.bracket = data.bracket;
        user.email = data.email;
        user.name = data.name;
        user.pfp = data.pfp;
        user.permissions = data.permissions;
        container.item(user.id, user.userid).replace(user);
    }
    else {
        const user = (await container.item(payload.uid, payload.uid).read()).resource;
        if (user == null) {
            return new Response("user not found", { status: 404 });
        }
        const data = await req.json();
        if (!data.role || !data.experiencelevel || !data.bracket) {
            return new Response("Bad body", { status: 400 });
        }
        user.role = data.role;
        user.experiencelevel = data.experiencelevel;
        user.bracket = data.bracket;
        container.item(user.id, user.userid).replace(user);
    }
    refreshSession();
    return new Response("Success", { status: 200 });
}