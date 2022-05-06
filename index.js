const express = require("express")
const app = express()
const port = process.env.PORT || 5000

const cors = require("cors")

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://notes1:J6EI99tCwCORmNmS@cluster0.dnjxk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const NotesCollection = client.db("NoteTracker").collection("Notes");

        app.get("/notes", async (req, res) => {
            const q = req.query
            const cursor = NotesCollection.find(q)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post("/notes", async (req, res) => {
            const doc = req.body
            const result = await NotesCollection.insertOne(doc)
            res.send(result)
        })

        app.delete("/notes/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await NotesCollection.deleteOne(query)
            res.send(result)
        })

        app.put("/notes/:id", async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const doc = {
                $set: {
                    "name": data.name,
                    "text": data.text
                }
            }
            const result = await NotesCollection.updateOne(filter, doc, options)
            res.send(result)
        })
    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir)
/* client.connect(err => {
    
    // perform actions on the collection object
    console.log("db connected")
    client.close();
}); */


app.get("/", (req, res) => {
    res.send("look mama error")

})

app.listen(port, () => {
    console.log("look mama error", port)
})