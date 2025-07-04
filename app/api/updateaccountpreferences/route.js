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
    if (isAdmin && incomingurl.searchParams.has("id") && incomingurl.searchParams.has("provider")) {
        const query = {
            query: sqlstring.format("SELECT * from c WHERE c.userid=? AND c.provider=?", [incomingurl.searchParams.get("id"), incomingurl.searchParams.get("provider")])
        }
        const user = await container.items.query(query).fetchAll();
        if(user.resources.length != 1){
            return new Response("Account not found", { status: 404 });
        }
        var userdata = user.resources[0];
        const data = await req.json();
        if(!data.role || !data.attendeetype || !data.experiencelevel || data.lookingforteam == null || !data.bracket || !data.email || !data.name || !data.pfp || !data.permissions){
            return new Response("missing data", {status: 400});
        }
        userdata.role = data.role;
        userdata.attendeetype = data.attendeetype;
        userdata.experiencelevel = data.experiencelevel;
        userdata.lookingforteam = data.lookingforteam;
        userdata.bracket = data.bracket;
        userdata.email = data.email;
        userdata.name = data.name;
        userdata.pfp = data.pfp;
        userdata.permissions = data.permissions;
        container.item(userdata.id, userdata.userid).replace(userdata);
    }
    else {
        const query = {
            query: sqlstring.format("SELECT * from c WHERE c.userid=? AND c.provider=?", [payload.uid, payload.provider])
        }
        const items = await container.items.query(query).fetchAll();
        if (items.resources.length != 1) {
            return new Response("Account not found", { status: 404 });
        }
        var userdata = items.resources[0];
        const data = await req.json();
        if (!data.role || !data.attendeetype || !data.experiencelevel || !data.lookingforteam || !data.bracket) {
            return new Response("Bad body", { status: 400 });
        }
        userdata.role = data.role;
        userdata.attendeetype = data.attendeetype;
        userdata.experiencelevel = data.experiencelevel;
        userdata.lookingforteam = data.lookingforteam;
        userdata.bracket = data.bracket;
        container.item(userdata.id, userdata.userid).replace(userdata);
    }
    refreshSession();
    return new Response("Success", { status: 200 });
}