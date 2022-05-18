const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const fileUpload = require('express-fileupload');
// const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000;

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmioh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("fakeAccountNo");
        const accountCollection = database.collection("bbBank");
        const userBalanceCollection = database.collection("userBalance");
        const reviewCollection = database.collection("review");
        const usersCollection = database.collection('users');

        // const merchantsCollection = database.collection("merchants");



        const budgetCollection = database.collection("budget");


        //add budget
        app.post('/budget', async (req, res) => {
            const budget = req.body;
            console.log(budget);
            const result = await budgetCollection.insertOne(budget);
            res.json(result);
        });

        // GET budget
        app.get('/getBudget', async (req, res) => {
            const budget = await budgetCollection.find({}).toArray();
            res.send(budget);
        });


        app.get('/accountno', async (req, res) => {
            const cursor = accountCollection.find({});
            const accountno = await cursor.toArray();
            res.send(accountno);
        })

        //add money

        app.post('/addMoney', async (req, res) => {
            // console.log('req', req.body);
            const addMoney = req.body;
            const result = await userBalanceCollection.insertOne(addMoney)
            res.json(result);
        })

        app.put('/users/:email', async (req, res) => {
            console.log(req.params.email);
            const param = req.params.email;
            const split = param.split("_");



            const email = split[0];
            const amount = split[1];

            console.log(email, amount);

            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    newAmount: amount,
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);

            console.log(result);
            res.json(result);
            // console.log(result);


        })




        app.get('/addMoney', async (req, res) => {
            const cursor = userBalanceCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        //review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);

            res.json(result);

        })


        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })


        // user

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });



        app.get("/users/:id", async (req, res) => {
            const result = await usersCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0])
        })



    }
    finally {

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})