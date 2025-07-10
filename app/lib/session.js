import 'server-only'
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from "next/headers";
import { CosmosClient } from '@azure/cosmos';
const sqlstring = require('sqlstring')
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

const encodedKey = new TextEncoder().encode(process.env.COOKIE_SECRET);

export async function encrypt(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session) {
    if(!session){
        return null;
    }
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"]
        })
        return payload;
    }
    catch (err) {
        return null;
    }
}

export async function createSession(uid, provider) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ uid, provider, expiresAt })
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.DOMAIN.includes("https"),
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    });
}

export async function refreshSession() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null;
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.DOMAIN.includes("https"),
        expires: expires,
        sameSite: 'lax',
        path: '/'
    });
}

export async function deleteSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) {
        return null;
    }
    (await cookies()).delete('session');
}

export async function GetIsAdmin(session) {
    if (!session) {
        return false;
    }
    const payload = await decrypt(session);
    const query = {
        query: sqlstring.format("SELECT * from c WHERE c.userid=? AND c.provider=?", [payload.uid, payload.provider])
    }
    const items = await container.items.query(query).fetchAll();
    if (items.resources.length == 1 && items.resources[0].permissions == "admin") {
        return true;
    }
    return false;
}