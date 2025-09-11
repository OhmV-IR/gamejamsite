import { CosmosClient } from "@azure/cosmos";
import { decrypt, refreshSession } from "@/app/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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
const teamcontainer = (await database.containers.createIfNotExists({ id: process.env.TEAMSCONTAINER_ID })).container;

const { BlobServiceClient } = require("@azure/storage-blob");
const blobClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNSTR);

export async function GET(req) {
    const session = (await cookies()).get("session")?.value;
    if (!session) {
        return new Response("No session", { status: 401 });
    }
    const payload = await decrypt(session);
    if (!payload) {
        return new Response("Bad session", { status: 400 });
    }
    const user = (await container.item(payload.uid, payload.uid).read()).resource;
    if (user == null) {
        return new Response("user not found", { status: 404 });
    }
    PerformDelete(payload, user);
    return NextResponse.redirect(process.env.DOMAIN + "/");
}

export async function PerformDelete(payload, user) {
    container.item(user.id, user.id).delete();
    const memberteams = (await teamcontainer.items.query({
        query: sqlstring.format("SELECT * FROM c WHERE ARRAY_CONTAINS(c.members, { 'uid': ? })", [payload.uid])
    }).fetchAll()).resources;
    // The user should only be part of 1 team, this running multiple times is an if all else fails scenario, at least we keep to the privacy regulations
    for (let i = 0; i < memberteams.length; i++) {
        memberteams[i].members = memberteams[i].members.filter(member => member.uid != payload.uid);
        if (memberteams[i].members.length == 0 || payload.uid == memberteams[i].owner.uid) {
            if (memberteams[i].submission.state == 1) {
                const blobContainer = blobClient.getContainerClient(memberteams[i].id);
                blobContainer.deleteIfExists();
            }
            teamcontainer.item(memberteams[i].id, memberteams[i].id).delete();
        }
        else {
            teamcontainer.item(memberteams[i].id, memberteams[i].id).replace(memberteams[i]);
        }
    }
    const jrqteams = (await teamcontainer.items.query({
        query: sqlstring.format('SELECT * FROM c WHERE ARRAY_CONTAINS(c.joinrequests, { "uid": ? })', [payload.uid])
    }).fetchAll()).resources;
    for (let i = 0; i < jrqteams.length; i++) {
        jrqteams[i].joinrequests = jrqteams[i].joinrequests.filter(jrq => jrq.uid != payload.uid);
        teamcontainer.item(jrqteams[i].id, jrqteams[i].id).replace(jrqteams[i]);
    }
}