require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uf8t3so.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const plantCollection = client.db("plantDB").collection("plants");

    const usersCollection = client.db("plantDB").collection("users");
    // const slidesCollection = client.db('plantDB').collection('slides');
    // const dummyCollection = client.db('plantDB').collection('users');

    app.get("/plants", async (req, res) => {
      // const cursor = coffeesCollection.find();

      const result = await plantCollection
        .find()

        .toArray();

      res.send(result);
    });
    // app.get('/slides', async (req, res) => {
    //     // const cursor = coffeesCollection.find();

    //     const result = await slidesCollection.find().toArray();
    //     res.send(result);
    // });
    // app.get('/dummy', async (req, res) => {
    //     // const cursor = coffeesCollection.find();

    //     const result = await dummyCollection.find().toArray();
    //     res.send(result);
    // });

    app.get("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await plantCollection.findOne(query);
      res.send(result);
    });

    app.post("/plants", async (req, res) => {
      const newPlant = req.body;
      console.log(newPlant);
      const result = await plantCollection.insertOne(newPlant);
      res.send(result);
    });

    app.put("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedPlant = req.body;
      const updatedDoc = {
        $set: updatedPlant,
      };

      // const updatedDoc = {
      //     $set: {
      //         name: updatedCoffee.name,
      //         supplier: updatedCoffee.supplier
      //     }
      // }

      const result = await plantCollection.updateOne(
        filter,
        updatedDoc,
        options
      );

      res.send(result);
    });

    app.delete("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await plantCollection.deleteOne(query);
      res.send(result);
    });

    // User related APIs
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    });

    app.patch("/users", async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email };
      const updatedDoc = {
        $set: {
          lastSignInTime: lastSignInTime,
        },
      };

      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on: ${port}`);
});
