const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhxyp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(cors())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJhonBusiness").collection("products");
  const ordersCollection = client.db("emaJhonBusiness").collection("order");
  
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertMany(products)
    .then(result => {
      console.log(result.insertedCount)
      res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/products/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: {$in : productKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)