const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());






const uri = `mongodb+srv://mdhabibullah7520:${process.env.BD_USER_PASSWORD}@kqhtrades.fpfb50u.mongodb.net/?retryWrites=true&w=majority&appName=kqhtrades`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
    // // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const itemsCollection = client.db("kqhtrades_storage").collection("products");

    const usersCollection = client.db("kqhtrades_storage").collection("users")
    // const products={name:"habib",post:"sljoert"}
    // const result =await itemsCollections.insertOne(products)
    // res.send(result)
    app.get('/users', async (req, res) => {
      const query = {}
      const getUsers = await usersCollection.find(query).toArray();
      res.send(getUsers)
    });


    app.put('/addusers/admin/:id', async (req, res) => {
      const decodedEmail = req.decoded.email;
      const query = { email: decodedEmail };
      const user = await usersCollection.findOne(query)
      if (user?.role !== 'admin') {
          return res.status(403).send({ massage: 'forbiden access' })
      }


      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
              role: 'admin'
          }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
  })


    app.post('/addusers', async (req, res) => {
      const addUser = req.body;
      const collected = await usersCollection.insertOne(addUser);
      res.send(collected)
    });



    app.get('/sellers', async (req, res) => {
           
      let query = {};

      if (req.query.role) {
          query = {
              role: req.query.role
          }
      }
      const result = await usersCollection.find(query).toArray();
      res.send(result);
  })





    app.get('/catagory/:id', async (req, res) => {

      const id = req.params.id;

      const query = { catagory_id: (id) }

      const laptops = itemsCollections.find(query);
      const infoe = await laptops.toArray();
      // console.log(infoe)
      res.send(infoe)
    })


    app.post('/product', async (req, res) => {
      const addProduct = req.body;
      console.log(addProduct)
      const result = await itemsCollection.insertOne(addProduct);

      res.send(result)
    })


    // My products seller email based load this
    // app.get('/products', async (req, res) => {
    //   const email = req.query.email;
    //   const decodedEmail = req.decoded.email;
    //   if (email !== decodedEmail) {
    //     return res.status(403).send({ massage: 'forbidden access' })
    //   }
    //   const query = { email: email }
    //   const result = await itemsCollections.find(query).toArray();
    //   res.send(result)
    // })




    //   app.get('/allProducts', async (req, res) => {
    //     const query = {}
    //     console.log(query)
    //     const goods = await itemsCollections.find(query).toArray();
    //     res.send(goods)
    // })

  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})