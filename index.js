const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
const password = 'F@yez177937';

//=====================
const uri = "mongodb+srv://organicUser:F@yez177937@cluster0.389bf.mongodb.net/organicDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

// database

client.connect(err => {
  const collection = client.db("organicDB").collection("product");

  //get data from database
  app.get('/products', (req, res) => {
    collection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  // post data into database
  app.post("/addProducts", (req, res) => {
    const product = req.body;
    collection.insertOne(product)
      .then(result => {
        console.log("data added successfully");
        res.redirect('/')
      })
    console.log(product);
  })

  // delete data from database
  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({ _id: objectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

  //load single product for update
  app.get('/product/:id', (req, res) => {
    collection.find({ _id: objectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })
  // update database
  app.patch('/update/:id', (req, res) => {
    console.log(req.body)
    collection.updateOne({ _id: objectId(req.params.id) },
      {
        $set: { name: req.body.name, price: req.body.price, quantity: req.body.quantity }
      })
      .then(result => {
        res.send(result.modifiedCount> 0)
      })
  })
  console.log("database connected")
  // perform actions on the collection object
  // client.close();
});


app.listen(3000, console.log("request sending to 3000"))