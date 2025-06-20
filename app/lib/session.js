import 'server-only'
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from "next/headers";

const encodedKey = new TextEncoder().encode(process.env.COOKIE_SECRET);

export async function encrypt(payload){
    return new SignJWT(payload)
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session){
    try{
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"]
        })
        return payload;
    }
    catch(err){
        console.log("Failed to verify session");
    }
}

export async function createSession(uid, provider){
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({uid, provider, expiresAt})
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.DOMAIN.includes("https"),
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    });
}

export async function refreshSession(){
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session);

    if(!session || !payload){
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

export async function deleteSession(){
    const session = (await cookies()).get('session')?.value;
    if(!session){
        return null;
    }
    (await cookies()).delete('session');
}