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

export async function POST(req) {
    const incomingurl = new URL(req.url);
    const session = (await cookies()).get("session")?.value;
    if (!session) {
        return new Response("No session", { status: 401 });
    }
    const payload = await decrypt(session);
    if (!payload) {
        return new Response("Bad session", { status: 400 });
    }
    refreshSession();
    const user = (await container.item(payload.uid, payload.uid).read()).resource;
    if (user == null) {
        return new Response("user not found", { status: 404 });
    }
    if (user.permissions == "admin" && incomingurl.searchParams.has("userid")) {
        const userrequested = (await container.item(incomingurl.searchParams.get("userid"), incomingurl.searchParams.get("userid")).read()).resource;
        return new Response(JSON.stringify(userrequested), { status: 200 });
    } else {
        // user has not finished setup
        if (user.experiencelevel == null) {
            return new Response(process.env.DOMAIN + "/finishaccount", { status: 307 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
    }
}