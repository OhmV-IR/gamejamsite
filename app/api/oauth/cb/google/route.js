import { NextResponse } from "next/server";
const {OAuth2Client} = require('google-auth-library');
const {google} = require('googleapis');
import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv');
dotenv.config();
import { createSession, refreshSession } from "@/app/lib/session"
const sqlstring = require('sqlstring');

const endpoint = process.env.DB_ENDPOINT;
const key = process.env.DB_KEY;

const dbclient = new CosmosClient({
    endpoint,
    key
});

const { database } = await dbclient.databases.createIfNotExists({id: process.env.DB_ID});
const { container } = await database.containers.createIfNotExists({id: process.env.USERCONTAINER_ID});

const auth = new OAuth2Client({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL
});

export async function GET(req){
    const params = new URL(req.url);
    const tokenres = await auth.getToken(params.searchParams.get("code"));
    auth.setCredentials(tokenres.tokens);
    const oauth2 = google.oauth2({version: "v2", auth: auth});
    const userres = await oauth2.userinfo.get();
    var user = {
        userid: userres.data.id,
        email: userres.data.email,
        name: userres.data.name,
        pfp: userres.data.picture,
        provider: "google"
    }
    const query = {
        query: sqlstring.format("SELECT * from c WHERE c.userid=?", user.userid)
    }
    const existinguser = await container.items.query(query).fetchAll();
    await createSession(userres.data.id, "google");
    if(existinguser.resources.length != 0){
        return NextResponse.redirect(process.env.DOMAIN + "/dashboard");
    }
    container.items.create(user);
    return NextResponse.redirect(process.env.DOMAIN + "/finishaccount");
}