import { AddToBanList } from "@/app/lib/banlist";
import { maxfilesize } from "@/app/lib/submission";
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
const usercontainer = (await database.containers.createIfNotExists({id: process.env.USERCONTAINER_ID})).container;
const { BlobClient } = require("@azure/storage-blob");

export async function POST(req) {
    const body = await req.json();
    // Event subscription set up to only send 1 event at a time
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
        const blobname = event.subject.match(/blobs\/(.+)$/)[1];
        const containername = event.subject.match(/containers\/([^\/]+)\/blobs/)[1];
        if(event.data.contentLength == 0){
            return new Response("handled empty file", {status: 200});
        }
        const team = (await teamcontainer.items.query(sqlstring.format("SELECT * FROM c WHERE c.id=?", containername)).fetchAll()).resources[0];
        if (team == null) {
            const blob = new BlobClient(process.env.BLOB_CONNSTR, containername, blobname);
            blob.deleteIfExists({
                deleteSnapshots: "include"
            });
            return new Response("handled evt", { status: 200 });
        }
        if (event.data.contentLength > maxfilesize) {
            const blob = new BlobClient(process.env.BLOB_CONNSTR, containername, blobname);
            blob.deleteIfExists({
                deleteSnapshots: "include"
            });
            const user = (await usercontainer.items.query(sqlstring.format("SELECT * FROM c WHERE c.userid=?", [team.owner.uid])).fetchAll()).resources[0];
            if(user == null){
                console.error("could not find account of team owner uploading invalid submission");
                return false;
            }
            await AddToBanList(user.email);
            return new Response("Handled SubmissionCreated event", { status: 200 });
        }
        team.submission.state = 1;
        team.submission.url = event.data.url;
        team.submission.uploadtime = event.eventTime;
        team.submission.size = event.data.contentLength;
        team.submission.filename = blobname;
        await teamcontainer.item(team.id, team.id).replace(team);
        return new Response("Handled SubmissionCreated event", { status: 200 });
    } else {
        console.warn("Unrecognized event");
        return new Response("Unrecognized event", { status: 404 });
    }
}