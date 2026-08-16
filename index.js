const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const uri = process.env.MONGODB_URI

const app = express()
const PORT = process.env.PORT

app.use(cors());
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

        const bookingCollction = db.collection("bookings")

        // For Appointments Page
        app.get("/appointments", async (req, res) => {
            const result = await doctorsCollection.find().toArray();
            res.json(result);
        });

        // For Details page
        app.get("/appointments/:id", async (req, res) => {
            const { id } = req.params
            const result = await doctorsCollection.findOne({ _id: new ObjectId(id) });

            res.json(result);
        })

        // For Booking modal
        app.post("/booking", async (req, res) => {
            const bookingData = req.body;
            const result = await bookingCollction.insertOne(bookingData);

            res.json(result);
        })

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
