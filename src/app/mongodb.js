// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://sg7729:srEnuCzZKLITb6VI@chattercluster.ppak9za.mongodb.net/?retryWrites=true&w=majority&appName=chattercluster";

const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
