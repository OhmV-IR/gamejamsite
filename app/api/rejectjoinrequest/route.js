import { CosmosClient } from "@azure/cosmos";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session"
import { container } from "googleapis/build/src/apis/container";
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const teamcontainer = (await database.containers.createIfNotExists({ id: process.env.TEAMSCONTAINER_ID })).container;

export async function POST(req){
    const incomingbody = await req.json();
    if(incomingbody.uid == null || incomingbody.provider == null || incomingbody.tid == null){
        return new Response("missing rq details", {status: 400});
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if(payload == null){
        return new Response("no session", {status: 401});
    }
    const team = (await teamcontainer.items.query({
        query: sqlstring.format('SELECT * FROM c WHERE c.id=?', [incomingbody.tid])
    }).fetchAll()).resources[0];
    if(team == null){
        return new Response("team not found", {status: 404});
    }
    const index = team.joinrequests.findIndex(jr => jr.uid == incomingbody.uid && jr.provider == incomingbody.provider);
    if(index == -1){
        return new Response("jr not found", {status: 400});
    }
    team.joinrequests.splice(index, 1);
    teamcontainer.item(team.id, team.id).replace(team);
    return new Response("removed join rq", {status: 200});
}