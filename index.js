const express = require('express');
const dotenv = require('dotenv');
// const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const uri = process.env.MONGODB_URI

const app = express()
const PORT = process.env.PORT

// app.use(cors());
app.use(express.json());

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

        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");

        const db = client.db("DocAppoint");
        const doctorsCollection = db.collection("doctors");

        app.get("/appointments", async (req, res) => {
            const result = await doctorsCollection.find().toArray();
            res.send(result);
        });

        return client;
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running fine!')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
