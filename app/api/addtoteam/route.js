import { decrypt, GetIsAdmin } from "@/app/lib/session";
import { IsPartOfTeam, RemoveAllJoinRequests } from "@/app/lib/teams";
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
    if(incomingbody.id == null || incomingbody.uid == null){
        return new Response("missing info", {status: 400});
    }
    const session = (await cookies()).get("session")?.value;
    if(!(await GetIsAdmin(session))){
        return new Response("not enough rights", {status: 403});
    }
    if(await IsPartOfTeam(incomingbody.uid)){
        return new Response("person already on team", {status: 406});
    }
    try{
        const team = (await container.item(incomingbody.id, incomingbody.id).read()).resource;
        team.members.push({
            uid: incomingbody.uid,
        });
        // Must be awaited to avoid a race con where this is replaced after RemoveAllJoinRequests pulls the file, which then causes the member add to be overwritten
        await container.item(team.id, team.id).replace(team);
        RemoveAllJoinRequests(incomingbody.uid);
        return new Response("added person to team", {status: 200});
    } catch(err){
        return new Response("Could not find team", {status: 404});
    }
}