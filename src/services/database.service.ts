// External Dependencies

import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";


// Global Variables

export const collections: {
  todos?: mongoDB.Collection;
  register?: mongoDB.Collection;
  login?:mongoDB.Collection
} = {};

export const database:{
  db?:mongoDB.Db;
} ={}

// Initialize Connection



   export async function connectToDatabase() {
    dotenv.config();
  
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
      process.env.DB_CONN_STRING!
    );
  
    await client.connect();
  
      const db: mongoDB.Db = client.db(process.env.DB_NAME);

      database.db = db;
  
    const todosCollection: mongoDB.Collection = db.collection(
      process.env.TODOS_COLLECTION_NAME!
    );
  
    collections.todos = todosCollection;
  
    const registerCollection: mongoDB.Collection = db.collection(
      process.env.REGISTER_COLLECTION_NAME!
    );
  
    collections.register = registerCollection;

    const loginCollection: mongoDB.Collection = db.collection(
      process.env.LOGIN_COLLECTION_NAME!
    );
  
    collections.login = loginCollection;
  
    console.log(
      `succesfully connected to database: ${db.databaseName} and collection: ${todosCollection.collectionName}`
    );
  }



