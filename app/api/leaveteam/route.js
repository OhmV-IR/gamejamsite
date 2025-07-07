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
    if(incomingbody.tid == null){
        return new Response("missing data", {status: 400});
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if(payload == null){
        return new Response("no session", {status: 401});
    }
    const team = (await teamcontainer.items.query({
        query: sqlstring.format('SELECT * from c WHERE c.id=?', [incomingbody.tid])
    }).fetchAll()).resources[0];
    if(team == null){
        return new Response("team not found", {status: 404});
    }
    if(team.members.splice({uid: payload.uid, provider: payload.provider}) == null){
        return new Response("not part of team", {status: 403});
    }
    if(team.members.length > 0){
        teamcontainer.item(team.id, team.id).replace(team);
    }
    else{
        teamcontainer.item(team.id, team.id).delete();
    }
    return new Response("left team successfully", {status: 200});
}