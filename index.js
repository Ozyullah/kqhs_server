const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5001

app.use(cors())
app.use(express.json());






const uri = `mongodb+srv://mdhabibullah7520:${process.env.BD_USER_PASSWORD}@kqhtrades.fpfb50u.mongodb.net/?retryWrites=true&w=majority&appName=kqhtrades`;


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

    const categoryCollection = client.db("kqhtrades_storage").collection("category");

    const usersCollection = client.db("kqhtrades_storage").collection("users")
    // const products={name:"habib",post:"sljoert"}
    // const result =await itemsCollections.insertOne(products)
    // res.send(result)
    app.get('/users', async (req, res) => {
      const query = {}
      const getUsers = await usersCollection.find(query).toArray();
      res.send(getUsers)
    });


    app.put('/users/admin/:id', async (req, res) => {
      // const decodedEmail = req.decoded.email;
      // console.log(decodedEmail)
      // const query = { email: decodedEmail };
      // const user = await usersCollection.findOne(query)
      // if (user?.role !== 'admin') {
      //     return res.status(403).send({ massage: 'forbiden access' })
      // }


      const id = req.params.id;
      
      const filter = { _id: new ObjectId(id) }
      console.log(filter)
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
              role: 'admin'
          }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
  })



  app.get('/users/admin/:email', async(req, res)=>{
    const email = req.params.email;
    const query = { email }
    const user = await usersCollection.findOne(query);
    res.send({ isAdmin: user?.role === 'admin' })
})


app.delete('/users/delete/:id', async (req, res) => {
  const id = req.params.id;
  // console.log(ObjectId(id))
  const query = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});


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




  app.put('/users/verify/:id', async (req, res) => {
    const id = req.params.id
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            quality: 'varifyed'
        }
    }
    const result = await usersCollection.updateOne(filter, updatedDoc, options);
    res.send(result)
});



app.delete('/users/delete/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});



    app.get('/catagory/:id', async (req, res) => {

      const id = req.params.id;

      const query = { catagory_id: (id) }

      const laptops = itemsCollection.find(query);
      const infoe = await laptops.toArray();
      // console.log(infoe)
      res.send(infoe)
    })



    app.get('/productsDetails/:id', async (req, res) => {

      const id = req.params.id;
      console.log(id)

      const query = { _id: new ObjectId(id) }

      console.log(query)

      const productOne = await itemsCollection.findOne(query);
      // const infoeCatagory =await laptopsOne.toArray();
      // console.log(infoe)
      res.send(productOne)
  })


    app.post('/product', async (req, res) => {
      const addProduct = req.body;
      console.log(addProduct)
      const result = await itemsCollection.insertOne(addProduct);

      res.send(result)
    })


    // added Category
    app.post('/category', async (req, res) => {
      const addCategory = req.body;
     
      const result = await categoryCollection.insertOne(addCategory);

      res.send(result)
    })


    app.get('/catagory', async (req, res) => {
      const query = {}
      const result = categoryCollection.find(query);
      const data = await result.toArray()
      res.send(data)
  });


    // My products seller email based load this
    app.get('/myproducts/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email)
      // const decodedEmail = req.decoded.email;
      // if (email !== decodedEmail) {
      //   return res.status(403).send({ massage: 'forbidden access' })
      // }
      const query = { email: email }
      console.log(query)
      const result = await itemsCollection.find(query).toArray();
      res.send(result)
    })



    // seller Hook

    app.get('/seller/:email', async(req, res)=>{
      const email = req.params.email;
      console.log(email)
      const query = { email }
      const seller = await usersCollection.findOne(query);
      res.send({isSeller: seller.role === 'Seller'})
  })

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