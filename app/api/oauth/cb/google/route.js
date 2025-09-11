import { NextResponse } from "next/server";
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv');
dotenv.config();
import { createSession, refreshSession } from "@/app/lib/session"
import { IsBanned } from "@/app/lib/banlist";
const sqlstring = require('sqlstring');

const endpoint = process.env.DB_ENDPOINT;
const key = process.env.DB_KEY;

const dbclient = new CosmosClient({
    endpoint,
    key
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const { container } = await database.containers.createIfNotExists({ id: process.env.USERCONTAINER_ID });

const auth = new OAuth2Client({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL
});

export async function GET(req) {
    const params = new URL(req.url);
    const tokenres = await auth.getToken(params.searchParams.get("code"));
    auth.setCredentials(tokenres.tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: auth });
    const userres = await oauth2.userinfo.get();
    if (await IsBanned(userres.data.email)) {
        return new Response("Please contact jambytesteam@gmail.com with your email and ask about error 403 when creating an account.", { status: 403 });
    }
    var user = {
        userid: userres.data.id,
        email: userres.data.email,
        name: userres.data.name,
        pfp: userres.data.picture,
        provider: "google",
        permissions: "user",
    }
    const query = {
        query: sqlstring.format('SELECT * from c WHERE c.userid=? AND c.provider="google"', user.userid)
    }
    const existinguser = await container.items.query(query).fetchAll();
    if (existinguser.resources.length != 0) {
        await createSession(existinguser.resources[0].id);
        return NextResponse.redirect(process.env.DOMAIN + "/myteam");
    }
    await createSession((await container.items.create(user)).resource.id);
    return NextResponse.redirect(process.env.DOMAIN + "/finishaccount");
}