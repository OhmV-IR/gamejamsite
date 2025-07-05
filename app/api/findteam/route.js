import { CosmosClient } from "@azure/cosmos";
const sqlstring = require('sqlstring');
const dotenv = require('dotenv');
dotenv.config();
const endpoint = process.env.DB_ENDPOINT;
const key = process.env.DB_KEY;

const dbclient = new CosmosClient({
    endpoint,
    key
});

const { database } = await dbclient.databases.createIfNotExists({id: process.env.DB_ID});
const { container } = await database.containers.createIfNotExists({id: process.env.TEAMSCONTAINER_ID});

export async function POST(req){
    const incomingurl = new URL(req.url);
    if(!incomingurl.searchParams.get("term")){
        return new Response("no search term", {status: 400});
    }
    var term = incomingurl.searchParams.get("term") + "%";
    const query = {
        query: sqlstring.format('SELECT * from c WHERE c.name LIKE ? OFFSET 0 LIMIT 10', [term, term])
    }
    const teams = (await container.items.query(query).fetchAll()).resources;
    return new Response(JSON.stringify({teams}), {status: 200});
}