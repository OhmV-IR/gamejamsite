import { NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv');
dotenv.config();
import { createSession } from "@/app/lib/session"
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

export async function GET(req) {
    const paturl = new URL("https://discord.com/api/oauth2/token");
    paturl.searchParams.append("grant_type", "authorization_code");
    paturl.searchParams.append("code", (new URL(req.url)).searchParams.get("code"));
    paturl.searchParams.append("redirect_uri", process.env.DISCORD_OAUTH_REDIRECT_URL);
    paturl.searchParams.append("client_id", process.env.DISCORD_OAUTH_CLIENT_ID);
    paturl.searchParams.append("client_secret", process.env.DISCORD_OAUTH_CLIENT_SECRET);
    const patres = await fetch(paturl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: paturl.searchParams.toString()
    });
    if (!patres.ok) {
        return new Response((await patres.text()), { status: 400 });
    }
    const patbody = await patres.json();
    const userdataurl = new URL("https://discord.com/api/v10/users/@me");
    const userdatares = await fetch(userdataurl, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + patbody.access_token
        }
    });
    if (!userdatares.ok) {
        return new Response((await userdatares.text()), { status: 400 });
    }
    const userdata = await userdatares.json();
    if (await IsBanned(userdata.email)) {
        return new Response("Please contact jambytesteam@gmail.com and ask about error 403 when creating an account.", { status: 403 });
    }
    var user = {
        userid: userdata.id,
        email: userdata.email,
        name: userdata.global_name,
        pfp: userdata.avatar ? `https://cdn.discordapp.com/avatars/${userdata.id}/${userdata.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png",
        provider: "discord",
        permissions: "user"
    }
    const query = {
        query: sqlstring.format("SELECT * from c WHERE c.userid=? AND c.provider=?", [user.userid, "discord"])
    }
    const existinguser = await container.items.query(query).fetchAll();
    if (existinguser.resources.length != 0) {
        await createSession(existinguser.resources[0].id);
        return NextResponse.redirect(process.env.DOMAIN + "/myteam");
    }
    await createSession((await container.items.create(user)).resource.id);
    return NextResponse.redirect(process.env.DOMAIN + "/finishaccount");
}