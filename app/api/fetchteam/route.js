import { CosmosClient } from "@azure/cosmos";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session"
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const teamcontainer = (await database.containers.createIfNotExists({ id: process.env.TEAMSCONTAINER_ID })).container;

export async function POST(req) {
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if (payload == null) {
        return new Response("no session", { status: 401 });
    }
    const team = (await teamcontainer.items.query({
        query: sqlstring.format('SELECT * FROM c WHERE ARRAY_CONTAINS(c.members, {"uid": ? }) OFFSET 0 LIMIT 1', [payload.uid])
    }).fetchAll()).resources[0];
    if (team == null) {
        return new Response("team not found", { status: 404 });
    }
    else {
        return new Response(JSON.stringify(team), { status: 200 });
    }
}