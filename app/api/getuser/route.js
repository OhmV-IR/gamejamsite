import { GetIsAdmin } from "@/app/lib/session";
import { CosmosClient } from "@azure/cosmos";
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
    const isadmin = await GetIsAdmin((await cookies()).get("session")?.value);
    const incomingurl = new URL(req.url);
    if (!incomingurl.searchParams.get("id")) {
        return new Response("no id provided", { status: 400 });
    }
    const userid = incomingurl.searchParams.get("id");
    const user = (await container.item(userid, userid).read()).resource;
    if (user == null) {
        return new Response("user not found", { status: 404 });
    }
    if (!isadmin) {
        return new Response(JSON.stringify({
            name: user.name,
            pfp: user.pfp,
            role: user.role,
            permissions: user.permissions,
            containsprivate: isadmin
        }), { status: 200 });
    } else {
        return new Response(JSON.stringify({
            name: user.name,
            pfp: user.pfp,
            role: user.role,
            email: user.email,
            experiencelevel: user.experiencelevel,
            bracket: user.bracket,
            permissions: user.permissions,
            containsprivate: isadmin
        }), { status: 200 });
    }
}