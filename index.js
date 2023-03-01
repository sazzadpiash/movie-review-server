const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

// midleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Travel Guide Server is running successfully!")
})

// assignment10 IU3jnI20EyJc0tJu


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.06w34xu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const places = client.db("travel-guide").collection("places");
        const review = client.db("travel-guide").collection("reviews");

        app.get('/place/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const cursor = places.findOne(query);

            res.send(await cursor)
            // res.send('asdasd')
        })    
        
        app.post('/reviews', async (req, res) => {
            const data = req.body;
            data.date = new Date();
            const result = await review.insertOne(data)
            const query = { _id: new ObjectId(result.insertedId) }
            const cursor = await review.findOne(query);
            res.send(cursor);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { place_id: id };
            sort = { date: -1 }
            const cursor = review.find(query).sort(sort);
            const result = cursor.toArray();
            res.send(await result)
        })
    }
    finally { }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('success')
})