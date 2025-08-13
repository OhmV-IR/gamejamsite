import { CosmosClient } from "@azure/cosmos";
import { decrypt, GetIsAdmin, refreshSession } from "@/app/lib/session";
import { cookies } from "next/headers";
import { PerformDelete } from "../deleteaccount/route";
import { AddToBanList } from "@/app/lib/banlist";
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
    const incomingbody = await req.json();
    if (incomingbody.uid == null || incomingbody.provider == null) {
        return new Response("missing info", { status: 400 });
    }
    const session = (await cookies()).get("session")?.value;
    if (!session) {
        return new Response("No session", { status: 401 });
    }
    const payload = await decrypt(session);
    if (!payload) {
        return new Response("Bad session", { status: 400 });
    }
    if (await GetIsAdmin(session) != true) {
        return new Response("not enough rights", { status: 403 });
    }
    const query = {
        query: sqlstring.format("SELECT * from c WHERE c.userid=? AND c.provider=?", [incomingbody.uid, incomingbody.provider])
    }
    const useracc = await container.items.query(query).fetchAll();
    if (useracc.resources.length != 1) {
        return new Response("user not found", { status: 404 });
    }
    // offload delete to async function
    PerformDelete({ uid: incomingbody.uid, provider: incomingbody.provider }, useracc);
    if (await AddToBanList(useracc.resources[0].email)) {
        return new Response("banned successfully", { status: 200 });
    } else {
        return new Response("failed to ban", { status: 500 });
    }
}