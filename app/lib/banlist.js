import { get } from '@vercel/edge-config';
import { createHash } from "crypto";

const dotenv = require('dotenv');
dotenv.config();

function getKeyFromEmail(email) {
    return Buffer.from(email, "utf-8").toString("hex");
}

export async function AddToBanList(email) {
    const res = await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,{
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${process.env.EDGE_CONFIG_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: [
                {
                    operation: "upsert",
                    key: getKeyFromEmail(email),
                    value: true
                }
            ]
        })
    });
    return res.ok;
};

export async function RemoveFromBanList(email){
    const res = await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${process.env.EDGE_CONFIG_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: [
                {
                    operation: "delete",
                    key: getKeyFromEmail(email)
                }
            ]
        })
    });
    return res.ok;
}

export async function IsBanned(email) {
    const banned = await get(getKeyFromEmail(email));
    return banned == true;
}