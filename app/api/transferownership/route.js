import { decrypt, GetIsAdmin } from "@/app/lib/session";
import { CosmosClient } from "@azure/cosmos";
import { cookies } from "next/headers";
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
    if(incomingbody.tid == null || incomingbody.uid == null){
        return new Response("missing data", {status: 400});
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if(payload == null){
        return new Response("no session", {status: 401});
    }
    const team = (await teamcontainer.item(incomingbody.tid, incomingbody.tid).read()).resource;
    if(!team.members.some(member => member.uid == incomingbody.uid)){
        return new Response("new owner must already be a member of the team", {status: 403});
    }
    if(!(await GetIsAdmin(session)) && payload.uid != team.owner.uid){
        return new Response("not enough rights", {status: 403});
    }
    team.owner.uid = incomingbody.uid;
    teamcontainer.item(team.id, team.id).replace(team);
    return new Response("updated successfully", {status: 200});
}