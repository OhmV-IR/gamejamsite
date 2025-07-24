import { CosmosClient } from "@azure/cosmos";
import { decrypt, GetIsAdmin, refreshSession } from "@/app/lib/session";
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

export async function GET(req){
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if(session == null || payload == null){
        return new Response("not authorized", {status: 401});
    }
    if(GetIsAdmin(session) == false){
        return new Response("not authorized", {status: 403});
    }
    const emails = (await container.items.query("SELECT VALUE c.email FROM c").fetchAll()).resources;
    return new Response(emails.join(" "), {status: 200});
}