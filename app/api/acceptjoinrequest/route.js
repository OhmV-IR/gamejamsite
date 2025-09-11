import { CosmosClient } from "@azure/cosmos";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session"
import { RemoveAllJoinRequests } from "@/app/lib/teams";
const dotenv = require('dotenv')
dotenv.config();

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const teamcontainer = (await database.containers.createIfNotExists({ id: process.env.TEAMSCONTAINER_ID })).container;

export async function POST(req) {
    const incomingbody = await req.json();
    if (incomingbody.uid == null || incomingbody.tid == null) {
        return new Response("missing rq details", { status: 400 });
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if (payload == null) {
        return new Response("no session", { status: 401 });
    }
    const team = (await teamcontainer.item(incomingbody.tid, incomingbody.tid).read()).resource;
    if(team == null){
        return new Response("no team found", {status: 404});
    }
    if (team.owner.uid != payload.uid) {
        return new Response("Not team owner", { status: 403 });
    }
    team.members.push({ uid: incomingbody.uid });
    await teamcontainer.item(team.id, team.id).replace(team);
    RemoveAllJoinRequests(incomingbody.uid);
    return new Response("added to team", { status: 200 });
}