import { CosmosClient } from "@azure/cosmos";
import { decrypt, refreshSession } from "@/app/lib/session";
import { cookies } from "next/headers";
const dotenv = require('dotenv')
dotenv.config();
import { IsPartOfTeam } from "@/app/lib/teams";

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({id: process.env.DB_ID});
const { container } = await database.containers.createIfNotExists({id: process.env.TEAMSCONTAINER_ID});

export async function POST(req){
    const incomingbody = await req.json();

    const session = (await cookies()).get("session")?.value
    if(!session){
        return new Response("No session", {status: 401});
    }
    const payload = await decrypt(session);
    if(!payload){
        return new Response("invalid session", {status: 400});
    }

    if(await IsPartOfTeam(payload.uid, payload.provider)){
        return new Response("already in team", {status: 406})
    }
    const team = {
        name: incomingbody.teamName,
        owner: {
            uid: payload.uid,
            provider: payload.provider
        },
        submissions: [],
        joinrequests: [],
        members: [
            {
                uid: payload.uid,
                provider: payload.provider
            }
        ]
    }
    container.items.create(team);
    return new Response("team created", {status: 200});
}