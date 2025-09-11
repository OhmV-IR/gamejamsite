import { decrypt, GetIsAdmin } from "@/app/lib/session";
import { CosmosClient } from "@azure/cosmos";
import { cookies } from "next/headers";
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const teamcontainer = (await database.containers.createIfNotExists({ id: process.env.TEAMSCONTAINER_ID })).container;
const { BlobServiceClient } = require("@azure/storage-blob");
const blobClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNSTR);

export async function POST(req) {
    const incomingbody = await req.json();
    if (incomingbody.tid == null) {
        return new Response("missing data", { status: 400 });
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if (payload == null) {
        return new Response("bad session", { status: 401 });
    }
    const team = (await teamcontainer.item(incomingbody.tid, incomingbody.tid).read()).resource;
    if (team == null) {
        return new Response("team not found", { status: 404 });
    }
    if (team.owner.uid != payload.uid && GetIsAdmin(session) == false) {
        return new Response("not enough rights", { status: 403 });
    }
    const blobContainer = blobClient.getContainerClient(team.id);
    blobContainer.deleteIfExists();
    team.submission = {};
    teamcontainer.item(team.id, team.id).replace(team);
    return new Response("submission deleted");
}