import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({ id: process.env.DB_ID });
const teamcontainer = (await database.containers.createIfNotExists({ id: process.env.TEAMSCONTAINER_ID })).container;

export async function POST(req){
    const incomingbody = await req.json();
    if(incomingbody.page == null){
        return new Response("missing pg", {status: 400});
    }
    const teams = (await teamcontainer.items.query({
        query: sqlstring.format("SELECT * FROM c OFFSET ? LIMIT 10", [incomingbody.page * 10])
    }).fetchAll()).resources;
    return new Response(JSON.stringify({teams: teams}), {status: 200});
}