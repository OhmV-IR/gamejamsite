import { CosmosClient } from "@azure/cosmos";
import { decrypt, refreshSession } from "@/app/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

export async function GET(req){
    const session = (await cookies()).get("session")?.value;
    if(!session){
        return new Response("No session", {status: 401});
    }
    const payload = await decrypt(session);
    if(!payload){
        return new Response("Bad session", {status: 400});
    }
    const query = {
        query: sqlstring.format("SELECT * from c WHERE c.userid=? AND c.provider=?", [payload.uid, payload.provider])
    }
    const items = await container.items.query(query).fetchAll();
    if(items.resources.length != 1){
        return new Response("user not found", {status: 401});
    }
    container.item(items.resources[0].id, items.resources[0].userid).delete();
    return NextResponse.redirect(process.env.DOMAIN + "/");
}