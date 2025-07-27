import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const teamcontainer = (await database.containers.createIfNotExists({ id: process.env.TEAMSCONTAINER_ID })).container;
const { BlobClient } = require("@azure/storage-blob");

const maxfilesize = 750 * 1024 * 1024; // 750MB

export async function POST(req) {
    // TODO: Run these submissions through VirusTotal to avoid malicious data being uploaded
    const body = await req.json();
    // Event subscription set up to only send 1 event at a time, could upgrade that later.
    const event = body[0];
    if (event.eventType == 'Microsoft.EventGrid.SubscriptionValidationEvent') {
        const validationCode = event.data.validationCode;
        return new Response(
            JSON.stringify({ validationResponse: validationCode }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
    if (req.headers.get("hookkey") != process.env.WEBHOOK_KEY) {
        return new Response("Unauthorized", { status: 401 });
    }
    if (event.eventType == 'Microsoft.Storage.BlobCreated') {
        const blobname = new URL(event.data.url).pathname.split("/").slice(2).join("/");
        if (event.data.contentLength > maxfilesize) {
            // Ban user(TODO) and delete the upload
            const blob = new BlobClient(process.env.BLOB_CONNSTR, process.env.BLOB_CONTAINER_NAME, blobname);
            console.log("Deleted uploaded blob for being too large");
            blob.deleteIfExists({
                deleteSnapshots: "include"
            });
            return new Response("Handled SubmissionCreated event", { status: 200 });
        }
        const team = (await teamcontainer.items.query(sqlstring.format("SELECT * FROM c WHERE c.id=?", blobname)).fetchAll()).resources[0];
        if (team == null) {
            // Ban user(TODO) and delete the upload
            const blob = new BlobClient(process.env.BLOB_CONNSTR, process.env.BLOB_CONTAINER_NAME, blobname);
            console.log("Deleted blob for not being able to find associated team");
            blob.deleteIfExists({
                deleteSnapshots: "include"
            });
            return new Response("handled evt", { status: 200 });
        }
        team.submission.state = 1;
        team.submission.url = event.data.url;
        team.submission.uploadtime = event.eventTime;
        team.submission.size = event.data.contentLength;
        teamcontainer.item(team.id, team.id).replace(team);
        return new Response("Handled SubmissionCreated event", { status: 200 });
    } else {
        console.warn("Unrecognized event");
        return new Response("Unrecognized event", { status: 404 });
    }
}

