const MongoClient = require('mongodb').MongoClient;
const dbName="sms-db";
const url = `mongodb://localhost:27017/${dbName}`;

function openDb(){
    new Promise((resolve , reject)=>{
        MongoClient.connect(url, (err, db)=> {
            if (err) return reject(err);
            return resolve(db);
        });
    })    
}

export function createDb(){
    new Promise((resolve , reject)=>{
        openDb().then((db)=>{
            let dbo=db.db(dbName);
            dbo.createCollection("messageSend", function(err, res) {
                if (err) return reject(err);
                console.log("Collection created!");
                db.close();
                return resolve(true);
            });
        })
    })
}

