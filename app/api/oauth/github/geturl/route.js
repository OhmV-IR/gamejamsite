import { NextResponse } from "next/server";
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();

const scopes = [
    "read:user",
    "user:email"
]

export async function POST(req){
    const oauthurl = new URL("https://github.com/login/oauth/authorize");
    oauthurl.searchParams.append("client_id", process.env.GITHUB_OAUTH_CLIENT_ID);
    oauthurl.searchParams.append("redirect_uri", process.env.GITHUB_OAUTH_REDIRECT_URL);
    oauthurl.searchParams.append("scope", scopes.join(" "));
    return NextResponse.json({url: oauthurl.toString()});
}