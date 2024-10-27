//This file handles the Database connection registeres in MongoDb atlas registered with acbikash13
require('dotenv').config();
const uri =  process.env.URI;
console.log("The Uri is " + uri )
const databaseName = process.env.DATABASE_NAME;

const { MongoClient} = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    let db;
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      db = client.db(databaseName);
      console.log("You successfully connected to MongoDB!");
    } catch (err) {
        console.log("Error connecting to the database " + err)
    }
    return db;
  }

module.exports =  connectToDatabase();
    






