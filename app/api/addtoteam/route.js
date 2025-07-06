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
    if(incomingbody.id == null || incomingbody.uid == null || incomingbody.provider == null){
        return new Response("missing info", {status: 400});
    }
    const session = (await cookies()).get("session")?.value;
    const query = {
        query: sqlstring.format("SELECT * FROM c WHERE c.id=?", [incomingbody.id])
    }
    const team = (await container.items.query(query).fetchAll()).resources[0];
    if(team == null){
        return new Response("team not found", {status: 404});
    }
    if(!(await GetIsAdmin(session)) && (team.owner.uid != provider.uid || team.owner.payload != payload.provider)){
        return new Response("not enough rights", {status: 403});
    }
    if(await IsPartOfTeam(incomingbody.uid, incomingbody.provider)){
        return new Response("person already on team", {status: 406});
    }
    if(rqindex != -1){
        team.joinrequests.splice(rqindex, 1);
    }
    team.members.push({
        uid: incomingbody.uid,
        provider: incomingbody.provider
    });
    container.item(team.id, team.id).replace(team);
    return new Response("added person to team", {status: 200});
}