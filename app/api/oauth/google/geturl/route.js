import { NextResponse } from "next/server";
const {OAuth2Client} = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();

const auth = new OAuth2Client({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL
});

const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid"
]

export async function POST(req, res){
    return NextResponse.json({url: auth.generateAuthUrl({
        access_type: "offline",
        scope: scopes.join(" "),
        prompt: "consent"
    })});
}