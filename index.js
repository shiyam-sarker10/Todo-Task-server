const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config(); // import env file if use environment variables after install || npm install dotenv --save|| ane Create a .env file in the root of your project:
const port = process.env.PORT || 5000;
const app = express();
// used Middleware
app.use(cors());
app.use(express.json());
// Connact With MongoDb Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obcasl9.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// Create a async fucntion to all others activity
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("TodoDB").collection("tasks");


        app.post("/addTask", async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });
        app.get("/tasks", async (req, res) => {
            try {
                if (!req.query.value) {
                    return res.status(400).json({ error: "No value provided" });
                }
                

                if (req.query.value == "all") {
                    const result = await taskCollection.find().toArray();
                    return res.json(result);
                }
                    const value = req.query.value;
                    const query = { Status: value };
                const result = await taskCollection.find(query).toArray();
                    res.json(result);

            } catch (error) {
                console.error("Error fetching user:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        app.put("/editTask", async (req, res) => {
            try {
                const body = req.body;
                if (!req.query.id) {
                    return res.status(400).json({ error: "No ID provided" });
                }

                const id = req.query.id;
                console.log(id);
                const query = { _id: new ObjectId(id) };

                const result = await taskCollection.updateOne(query, {
                    $set: { 
                        TaskName: body.TaskName,
                        TaskMsg: body.TaskMsg,
                        TaskDeadline: body.TaskDeadline,
                        TaskPriority: body.TaskPriority,
                        Status: body.Status
                     },
                });
                res.json(result);
            } catch (error) {
                console.error("Error updating request:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });


        app.patch("/updateTask", async (req, res) => {
            try {
                const body = req.body;
                if (!req.query.id) {
                    return res.status(400).json({ error: "No ID provided" });
                }

                const id = req.query.id;
                console.log(id);
                const query = { _id: new ObjectId(id) };

                const result = await taskCollection.updateOne(query, {
                    $set: { Status: body.Status },
                });
                res.json(result);
            } catch (error) {
                console.error("Error updating request:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        app.delete('/deleteTask', async (req, res) => {
            try {

                if (!req.query.id) {
                    return res.status(400).json({ error: "No ID Provided" })
                }
                const id = req.query.id
                const query = { _id: new ObjectId(id) };
                const result = await taskCollection.deleteOne(query)
                res.json(result);
            }
            catch (error) {
                console.error("Error updating request:", error);
                res.status(500).json({ error: "Internal sever error" })
            }

        })


    } finally {

    }
}
run().catch(console.dir);
// Root Api to check activity
app.get("/", (req, res) => {
    res.send("the project is working");
});
app.listen(port, () => {
    console.log(`This is server is running on port : ${port}`);
});