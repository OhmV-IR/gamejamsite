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
const { BlobServiceClient, ContainerSASPermissions } = require("@azure/storage-blob");
const blobClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNSTR);
const blobContainer = blobClient.getContainerClient(process.env.BLOB_CONTAINER_NAME);

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
    const team = (await teamcontainer.items.query(
        sqlstring.format("SELECT * FROM c WHERE c.id=?", incomingbody.tid)
    ).fetchAll()).resources[0];
    if (team == null) {
        return new Response("team not found", { status: 404 });
    }
    if ((team.owner.uid != payload.uid || team.owner.provider != payload.provider) && GetIsAdmin(session) == false) {
        return new Response("not enough rights", { status: 403 });
    }
    const blob = blobContainer.getBlobClient(team.id);
    const blobexists = await blob.exists();
    if (blobexists) {
        const leaseClient = blob.getBlobLeaseClient();
        try {
            leaseClient.acquireLease(60);
        } catch (err) {
            return new Response(err.message, { status: 500 });
        }
        await blob.deleteIfExists({
            deleteSnapshots: "include"
        });
    }
    blobContainer.getBlobClient(team.id).deleteIfExists({
        deleteSnapshots: "include"
    });
    team.submission = {};
    teamcontainer.item(team.id, team.id).replace(team);
    return new Response("submission deleted");
}