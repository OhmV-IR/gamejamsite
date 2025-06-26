import { GetIsAdmin } from "@/app/lib/session";
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

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const { container } = await database.containers.createIfNotExists({ id: process.env.USERCONTAINER_ID });

export async function POST(req) {
    const isadmin = await GetIsAdmin((await cookies()).get("session")?.value);
    const incomingurl = new URL(req.url);
    if (!incomingurl.searchParams.get("id")) {
        return new Response("no id provided", { status: 400 });
    }
    const id = incomingurl.searchParams.get("id");
    const userid = id.substring(0, id.length - 3);
    const providertag = id.substring(id.length - 3, id.length) + "%";
    const query = {
        query: sqlstring.format('SELECT * from c WHERE c.userid=? AND c.provider LIKE ?', [userid, providertag])
    }
    const users = (await container.items.query(query).fetchAll()).resources;
    if (users.length != 1) {
        return new Response("user not found", { status: 404 });
    }
    if (!isadmin) {
        return new Response(JSON.stringify({
            name: users[0].name,
            pfp: users[0].pfp,
            role: users[0].role,
            permissions: users[0].permissions,
            containsprivate: isadmin
        }), {status: 200});
    } else {
        return new Response(JSON.stringify({
            name: users[0].name,
            pfp: users[0].pfp,
            role: users[0].role,
            email: users[0].email,
            provider: users[0].provider,
            attendeetype: users[0].attendeetype,
            experiencelevel: users[0].experiencelevel,
            lookingforteam: users[0].lookingforteam,
            bracket: users[0].bracket,
            permissions: users[0].permissions,
            containsprivate: isadmin
        }), {status: 200});
    }
}