var MongoClient = require('mongodb').MongoClient;
var dbName = "sms-db";
var url = "mongodb://localhost:27017/" + dbName;
var openDb = new Promise(function (resolve, reject) {
    MongoClient.connect(url, function (err, db) {
        if (err)
            return reject(err);
        return resolve(db);
    });
});
var createDb = new Promise(function (resolve, reject) {
    openDb.then(function (db) {
    });
});
//# sourceMappingURL=database.js.map