const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-app';

MongoClient.connect(connectionURL, {useNewUrlParser: true})
  .then((client) => {
    const db = client.db(databaseName);
    db.collection('user').insertMany([
      {
        name: 'Mitul',
        age: 22
      },
      {
        name: 'Meet',
        age: 21,
      },
    ]);
    console.log('Database connected!');
  })
  .catch((e) => {
    console.log(e);
  });
