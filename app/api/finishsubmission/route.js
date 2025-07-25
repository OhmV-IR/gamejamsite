import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');
const { randomUUID } = require('crypto');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const teamcontainer = (await database.containers.createIfNotExists({id: process.env.TEAMSCONTAINER_ID})).container;
const { BlobServiceClient, BlobClient } = require("@azure/storage-blob");
const blobClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNSTR);
const blobContainer = blobClient.getContainerClient(process.env.BLOB_CONTAINER_NAME);

const maxfilesize = 750 * 1024 * 1024; // 750MB

export async function POST(req){
    const body = await req.json();
    if(req.headers.get("Authorization") != process.env.WEBHOOK_KEY){
        return new Response("Unauthorized", {status: 401});
    }
    // Event subscription set up to only send 1 event at a time, could upgrade that later.
    const event = body[0];
    if(event.eventType == 'Microsoft.EventGrid.SubscriptionValidationEvent'){
        const validationCode = event.data.validationCode;
        return new Response(JSON.stringify({
            validationResponse: validationCode
        }, {status: 200, headers: { 'Content-Type': 'application/json' }}));
    } else if (event.eventType == 'Microsoft.Storage.BlobCreated'){
        const blobname = new URL(event.data.url).pathname.split("/").slice(2).join("/");
        if(body.data.contentLength > maxfilesize){
            // Ban user(TODO) and delete the upload
            const blob = new BlobClient(process.env.BLOB_CONNSTR, process.env.BLOB_CONTAINER_NAME, blobname);
            blob.deleteIfExists({
                deleteSnapshots: true
            });
            return new Response("Handled SubmissionCreated event", {status: 200});
        }
        const team = (await teamcontainer.items.query(sqlstring.format("SELECT * FROM c WHERE ARRAY_CONTAINS(c.submissions, {'id':?, 'state': 0})", blobname)).fetchAll()).resources[0];
        if(team == null){
            // Ban user(TODO) and delete the upload
            const blob = new BlobClient(process.env.BLOB_CONNSTR, process.env.BLOB_CONTAINER_NAME, blobname);
            blob.deleteIfExists({
                deleteSnapshots: true
            });
            return new Response("handled evt", {status: 200});
        }
        const subindex = team.submissions.findIndex(submission => submission.id == blobname && submission.state == 0);
        team.submissions[subindex].state = 1;
        team.submissions[subindex].url = event.data.url;
        team.submissions[subindex].uploadtime = event.eventTime;
        teamcontainer.item(team.id, team.id).replace(team);
        return new Response("Handled SubmissionCreated event", {status: 200});
    } else {
        return new Response("Unrecognized event", {status: 404});
    }
}

