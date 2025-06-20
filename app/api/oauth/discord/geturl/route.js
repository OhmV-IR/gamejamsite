import { NextResponse } from "next/server";
const dotenv = require('dotenv');
dotenv.config();

const scopes = [
    "identify",
    "email",
]

export async function POST(req){
    const oauthurl = new URL("https://discord.com/oauth2/authorize");
    oauthurl.searchParams.append("client_id", process.env.DISCORD_OAUTH_CLIENT_ID);
    oauthurl.searchParams.append("response_type", "code");
    oauthurl.searchParams.append("redirect_uri", process.env.DISCORD_OAUTH_REDIRECT_URL);
    oauthurl.searchParams.append("scope", scopes.join(" "));
    return NextResponse.json({url: oauthurl.toString()});
}