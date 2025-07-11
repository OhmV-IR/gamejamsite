import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const { BlobServiceClient, ContainerSASPermissions } = require("@azure/storage-blob");
const blobClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNSTR);
const blobContainer = blobClient.getContainerClient(process.env.BLOB_CONTAINER_NAME);

export async function POST(req) {
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if (payload == null) {
        return new Response("bad session", { status: 401 });
    }
    const team = (await teamcontainer.items.query({
        query: sqlstring.format("SELECT * FROM c WHERE c.owner.uid=? AND c.owner.provider=?", [payload.uid, payload.provider])
    }).fetchAll()).resources[0];
    if (team == null) {
        return new Response("not owner of a team");
    }
    return new Response(JSON.stringify({
        url: await blobContainer.generateSasUrl({
            permissions: ContainerSASPermissions.parse(''),
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + 7200 * 1000)
        })
    }), { status: 200 });
}