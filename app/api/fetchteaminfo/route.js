import { decrypt, GetIsAdmin } from "@/app/lib/session";
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

const { database } = await dbclient.databases.createIfNotExists({id: process.env.DB_ID});
const { container } = await database.containers.createIfNotExists({id: process.env.TEAMSCONTAINER_ID});

export async function POST(req){
    const incomingbody = await req.json();
    if(incomingbody.id == null || typeof(incomingbody.id) != "string"){
        return new Response("Missing id", {status: 400});
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    var adminmode = await GetIsAdmin(session);
    const query = {
        query: sqlstring.format('SELECT * from c WHERE c.id=?', [incomingbody.id])
    }
    const team = (await container.items.query(query).fetchAll()).resources[0];
    if(!team){
        return new Response("team not found", {status: 404});
    }
    if(payload && payload.uid == team.owner.uid && payload.provider == team.owner.provider){
        adminmode = true;
    }
    if(!adminmode){
        team.joinrequests = null;
    }
    return new Response(JSON.stringify(team), {status: 200});
}