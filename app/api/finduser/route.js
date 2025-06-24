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
const { container } = await database.containers.createIfNotExists({id: process.env.USERCONTAINER_ID});

export async function POST(req){
    const incomingurl = new URL(req.url);
    if(!incomingurl.searchParams.get("term")){
        return new Response("no search term", {status: 400});
    }
    var term = "%" + incomingurl.searchParams.get("term") + "%";
    const query = {
        query: sqlstring.format('SELECT * from c WHERE c.email LIKE ? OR c.name LIKE ? OFFSET 0 LIMIT 5', [term, term])
    }
    const users = (await container.items.query(query).fetchAll()).resources;
    const filteredusers = [];
    for(let i = 0; i < users.length; i++){
        filteredusers.push(
            {
                name: users[i].name,
                email: users[i].email,
                pfp: users[i].pfp,
                id: users[i].userid + (users[i].provider).substr(0, 3)
            }
        )
    }
    return new Response(JSON.stringify({users: filteredusers}), {status: 200});
}