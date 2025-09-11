import { CosmosClient } from "@azure/cosmos";
import { refreshSession } from "@/app/lib/session";
const dotenv = require('dotenv');
dotenv.config();

const endpoint = process.env.DB_ENDPOINT;
const key = process.env.DB_KEY;

const dbclient = new CosmosClient({
    endpoint,
    key
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const { container } = await database.containers.createIfNotExists({ id: process.env.USERCONTAINER_ID });

export async function POST(req) {
    const incomingbody = await req.json();
    try {
        const user = (await container.item(incomingbody.uid, incomingbody.uid).read()).resource;
        refreshSession();
        return new Response(JSON.stringify({
            uid: user.userid,
            pfp: user.pfp,
            name: user.name
        }), { status: 200 });
    }
    catch (err) {
        return new Response("Could not find user", { status: 404 });
    }
}