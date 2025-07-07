import { NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv');
dotenv.config();
import { createSession } from "@/app/lib/session"
const sqlstring = require('sqlstring');

const endpoint = process.env.DB_ENDPOINT;
const key = process.env.DB_KEY;

const dbclient = new CosmosClient({
    endpoint,
    key
});

const { database } = await dbclient.databases.createIfNotExists({id: process.env.DB_ID});
const { container } = await database.containers.createIfNotExists({id: process.env.USERCONTAINER_ID});

export async function GET(req){
    var patUrl = new URL("https://github.com/login/oauth/access_token");
    patUrl.searchParams.append("client_id", process.env.GITHUB_OAUTH_CLIENT_ID);
    patUrl.searchParams.append("client_secret", process.env.GITHUB_OAUTH_CLIENT_SECRET);
    patUrl.searchParams.append("code", (new URL(req.url).searchParams.get("code")));
    patUrl.searchParams.append("redirect_uri", process.env.GITHUB_OAUTH_REDIRECT_URL);
    const res = await fetch(patUrl, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    });
    if(!res.ok){
        return new Response("invalid code", {status: 400});
    }
    const tokenbody = await res.json();
    const userres = await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            Authorization: "Bearer " + tokenbody.access_token
        }
    });
    if(!userres.ok){
        return new Response((await userres.text()), {status: 403});
    }
    const userdata = await userres.json();
    var user = {
        userid: userdata.id,
        email: userdata.email,
        name: userdata.name,
        pfp: userdata.avatar_url,
        provider: "github",
        permissions: "user"
    }
    const query = {
        query: sqlstring.format("SELECT * from c WHERE c.userid=? AND c.provider=?", [user.userid, "github"])
    }
    const existinguser = await container.items.query(query).fetchAll();
    await createSession(user.userid, "github");
    if(existinguser.resources.length != 0){
        return NextResponse.redirect(process.env.DOMAIN + "/myteam");
    }
    container.items.create(user);
    return NextResponse.redirect(process.env.DOMAIN + "/finishaccount");
}