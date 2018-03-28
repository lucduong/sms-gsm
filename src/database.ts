const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const openDb=new Promise((resolve , reject)=>{
    MongoClient.connect(url, (err, db)=> {
        if (err) return reject(err);
        return resolve(db);
    });
})


const createDb=new Promise((resolve , reject)=>{
    openDb.then((db)=>{

    })
})

