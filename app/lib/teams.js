import 'server-only'
import { CosmosClient } from "@azure/cosmos";
const dotenv = require('dotenv')
dotenv.config();
const sqlstring = require('sqlstring');

const dbclient = new CosmosClient({
    endpoint: process.env.DB_ENDPOINT,
    key: process.env.DB_KEY
});

const { database } = await dbclient.databases.createIfNotExists({id: process.env.DB_ID});
const teamcontainer = (await database.containers.createIfNotExists({id: process.env.TEAMSCONTAINER_ID})).container;

export async function IsPartOfTeam(uid, provider) {
    if ((await teamcontainer.items.query({
        query: sqlstring.format('SELECT * FROM c WHERE ARRAY_CONTAINS(c.members, { "uid": ?, "provider": ? }) OFFSET 0 LIMIT 1', [uid, provider])
    })
        .fetchAll()).resources.length > 0) {
        return true;
    }
    else {
        return false;
    }
}