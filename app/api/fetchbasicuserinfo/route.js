import { CosmosClient } from "@azure/cosmos";
import { decrypt, refreshSession } from "@/app/lib/session";
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
const { container } = await database.containers.createIfNotExists({id: process.env.USERCONTAINER_ID});

export async function POST(req){
    const incomingbody = await req.json();
    const query = {
        query: sqlstring.format("SELECT * from c WHERE c.userid=? AND c.provider=?", [incomingbody.uid, incomingbody.provider])
    }
    const items = await container.items.query(query).fetchAll();
    if(items.resources.length != 1){
        return new Response("user not found", {status: 404});
    }
    refreshSession();
    return new Response(JSON.stringify({
        uid: items.resources[0].userid,
        provider: items.resources[0].provider,
        pfp: items.resources[0].pfp,
        name: items.resources[0].name
    }), {status: 200});
}