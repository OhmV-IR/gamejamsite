import { CosmosClient } from "@azure/cosmos";
import { cookies } from "next/headers";
import { decrypt, GetIsAdmin } from "@/app/lib/session"
import { container } from "googleapis/build/src/apis/container";
import { RemoveAllJoinRequests } from "@/app/lib/teams";
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const teamcontainer = (await database.containers.createIfNotExists({ id: process.env.TEAMSCONTAINER_ID })).container;

const { BlobServiceClient, ContainerSASPermissions } = require("@azure/storage-blob");
const blobClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNSTR);
const blobContainer = blobClient.getContainerClient(process.env.BLOB_CONTAINER_NAME);

export async function POST(req) {
    const incomingbody = await req.json();
    if (incomingbody.uid == null || incomingbody.tid == null) {
        return new Response("missing info", { status: 400 });
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if (payload == null) {
        return new Response("no session", { status: 401 });
    }
    const team = (await teamcontainer.item(incomingbody.tid, incomingbody.tid).read()).resource;
    if (team == null) {
        return new Response("team not found", { status: 404 });
    }
    if (!GetIsAdmin(session) && payload.uid != team.owner.uid) {
        return new Response("not enough rights", { status: 403 });
    }
    team.members.filter(member => member.uid != incomingbody.uid);
    if (team.members.length == 0 || payload.uid == team.owner.uid) {
        if (team.submission.filename != null) {
            const blobContainer = blobClient.getContainerClient(team.id);
            blobContainer.deleteIfExists();
        }
        teamcontainer.item(team.id, team.id).delete();
    }
    else {
        teamcontainer.item(team.id, team.id).replace(team);
    }
    return new Response("Removed from team", { status: 200 });
}