import { CosmosClient } from "@azure/cosmos";
import { cookies } from "next/headers";
import { decrypt, GetIsAdmin } from "@/app/lib/session"
import { IconTextGrammar } from "@tabler/icons-react";
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
    if(incomingbody.tid == null || incomingbody.name == null || incomingbody.name.length > 30 || incomingbody.name == ""){
        return new Response("missing data", {status: 400});
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if(payload == null){
        return new Response("no session", {status: 401});
    }
    const team = (await teamcontainer.item(incomingbody.tid, incomingbody.tid).read()).resource;
    if(team == null){
        return new Response("team not found", {status: 404});
    }
    if(!GetIsAdmin(session) && payload.uid != team.owner.uid){
        return new Response("not enough rights", {status: 403});
    }
    team.name = incomingbody.name;
    teamcontainer.item(team.id, team.id).replace(team);
    return new Response("renamed team", {status: 200});
}