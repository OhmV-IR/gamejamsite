import { cookies } from "next/headers";
import { decrypt, GetIsAdmin } from "@/app/lib/session";
import { CosmosClient } from "@azure/cosmos";
import { IsJamRunning } from "@/app/lib/jamdetails";
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

export async function POST(req) {
    const incomingbody = await req.json();
    if (incomingbody.filename == null) {
        return new Response("missing data", { status: 400 });
    }
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if (payload == null) {
        return new Response("bad session", { status: 401 });
    }
    if ((await GetIsAdmin(session)) == false && IsJamRunning() == false) {
        return new Response("feat not available", { status: 403 });
    }
    const team = (await teamcontainer.items.query({
        query: sqlstring.format("SELECT * FROM c WHERE c.owner.uid=?", [payload.uid])
    }).fetchAll()).resources[0];
    if (team == null) {
        return new Response("not owner of a team", { status: 403 });
    }
    const blobContainer = blobClient.getContainerClient(team.id);
    await blobContainer.createIfNotExists({
        access: "blob"
    });
    // for every blob check if it is active and leased and if it is throw
    const blob = blobContainer.getBlobClient(incomingbody.filename);
    if ((await blob.exists()) && (await blob.getProperties()).leaseStatus == "locked") {
        return new Response("Blob is currently locked by another active lease", { status: 500 });
    }
    team.submission = {
        state: 0,
        filename: incomingbody.filename
    }
    await teamcontainer.item(team.id, team.id).replace(team);
    return new Response(JSON.stringify({
        url: await blobContainer.generateSasUrl({
            // Create and write
            permissions: ContainerSASPermissions.parse("rcw"),
            startsOn: new Date(Date.now() - 5 * 60 * 1000),
            expiresOn: new Date(Date.now() + 14400 * 1000)
        })
    }), { status: 200 });
}