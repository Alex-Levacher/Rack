const { MongoClient } = require('mongodb');

/**
* This function is not used for the moment
* because the BDD list is given in the rack config
* by the user
* TODO: Stop asking to the user the BDD list and use this function
*/
const findDatabases = url => new Promise((rs, rj) => {
    MongoClient.connect(url, (errConnect, client) => {
        if (errConnect) return rj(errConnect.message);
        const adminDb = client.db().admin();
        return adminDb.listDatabases((errAdmin, dbs) => {
            if (errAdmin) rj(errAdmin.message);
            else rs(dbs.databases.map(database => database.name));
            return client.close();
        });
    });
});

module.exports = findDatabases;
