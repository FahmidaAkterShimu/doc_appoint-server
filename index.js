const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
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

// Middleware function
const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)

const verifyToken = async (req, res, next) => {
    const authHeader = req?.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const { payload } = await jwtVerify(token, JWKS)
        console.log(payload);
        next()
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }
};

async function run() {
    try {
        await client.connect();

        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");

        const db = client.db("DocAppoint");
        const doctorsCollection = db.collection("doctors");

        const bookingCollection = db.collection("bookings")
        const userCollection = db.collection("user");

        // For Appointments Page
        app.get("/appointments", async (req, res) => {
            const result = await doctorsCollection.find().toArray();
            res.json(result);
        });

        // For Details page
        app.get("/appointments/:id", verifyToken, async (req, res) => {
            const { id } = req.params
            const result = await doctorsCollection.findOne({ _id: new ObjectId(id) });

            res.json(result);
        })

        // For Booking modal
        app.post("/booking", verifyToken, async (req, res) => {
            const bookingData = req.body;
            const result = await bookingCollection.insertOne(bookingData);

            res.json(result);
        })

        // For Dashboard-MyBookings
        app.get("/booking/:userId", verifyToken, async (req, res) => {
            const { userId } = req.params
            const result = await bookingCollection.find({ userId: userId }).toArray();

            res.json(result);
        })

        // For Booking delete by id
        app.delete('/booking/:bookingId', verifyToken, async (req, res) => {
            const { bookingId } = req.params;
            const result = await bookingCollection.deleteOne({ _id: new ObjectId(bookingId) });

            res.json(result);
        })


        // For Updating booking data
        app.patch("/booking/:bookingId", verifyToken, async (req, res) => {
            const { bookingId } = req.params;
            const updatedData = req.body;

            const result = await bookingCollection.updateOne(
                { _id: new ObjectId(bookingId) },
                { $set: updatedData }
            )

            res.json(result);
        });


        // For Updating User data
        app.patch("/user/:userId", verifyToken, async (req, res) => {
            const { userId } = req.params;
            const updatedData = req.body;

            const result = await userCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: updatedData }
            )

            res.json(result);
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
