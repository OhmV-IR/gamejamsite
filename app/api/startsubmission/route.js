import { cookies } from "next/headers";
import { decrypt, GetIsAdmin } from "@/app/lib/session";
import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const teamcontainer = (await database.containers.createIfNotExists({id: process.env.TEAMSCONTAINER_ID})).container;
const { BlobServiceClient, ContainerSASPermissions } = require("@azure/storage-blob");
const blobClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNSTR);
const blobContainer = blobClient.getContainerClient(process.env.BLOB_CONTAINER_NAME);

export async function POST(req) {
    const incomingbody = await req.json();
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if (payload == null) {
        return new Response("bad session", { status: 401 });
    }
    if((await GetIsAdmin(session)) == false){
        return new Response("feat not available yet", {status: 403});
    }
    const team = (await teamcontainer.items.query({
        query: sqlstring.format("SELECT * FROM c WHERE c.owner.uid=? AND c.owner.provider=?", [payload.uid, payload.provider])
    }).fetchAll()).resources[0];
    if (team == null) {
        return new Response("not owner of a team");
    }
    team.submission = {
        state: 0,
        filename: incomingbody.filename
    }
    teamcontainer.item(team.id, team.id).replace(team);
    blobContainer.getBlobClient(team.id).deleteIfExists({
        deleteSnapshots: "include"
    });
    return new Response(JSON.stringify({
        url: await blobContainer.generateSasUrl({
            // Create and write
            permissions: ContainerSASPermissions.parse("cw"),
            startsOn: new Date(Date.now() - 5 * 60 * 1000),
            expiresOn: new Date(Date.now() + 14400 * 1000)
        })
    }), { status: 200 });
}