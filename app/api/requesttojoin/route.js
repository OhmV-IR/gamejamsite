import { decrypt, GetIsAdmin } from "@/app/lib/session";
import { IsPartOfTeam } from "@/app/lib/teams";
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
    if(incomingbody.id == null){
        return new Response("missing data", {status: 400});
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if(payload == null){
        return new Response("bad session", {status: 401});
    }
    const team = (await container.item(incomingbody.id, incomingbody.id).read()).resource;
    if(team == null){
        return new Response("team not found", {status: 404});
    }
    if(await IsPartOfTeam(payload.uid)){
        return new Response("already on team", {status: 406});
    }
    team.joinrequests.push({
        uid: payload.uid,
    });
    container.item(team.id, team.id).replace(team);
    return new Response("requested to join", {status: 200});
}