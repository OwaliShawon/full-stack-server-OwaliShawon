const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config()


app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z1say.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5000
// console.log(process.env.DB_USER);
// console.log(uri);


app.get('/', (req, res) => {
    res.send('Hello World! laila eyee lailaa')
    // res.send('laila maaa lailaa')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("dorakataShop").collection("products");
    const ordersCollection = client.db("dorakataShop").collection("orders");
    // console.log('database connection established')

    app.post("/addProduct", (req, res) => {
        // console.log('req.body');
        const product = req.body;
        console.log(product);
        productsCollection.insertOne(product)
            .then(result => {
                console.log('one added successfully');
                // res.send(result.insertedCount);
            })
    })


    app.get('/products', (req, res) => {
        productsCollection.find()
            .toArray()
            .then(products => {
                // console.log("all documents", products)
                res.send(products);
            })
    })


    app.delete('/deleteProduct/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log('delete', id);
        productsCollection.findOneAndDelete({ _id: id })
            .then(documents => res.send(!!documents.value))
    })

    app.post("/addOrder", (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount);
            })
    })


    app.get('/orders', (req, res) => {
        ordersCollection.find()
            .toArray()
            .then(orders => {

                res.send(orders);
            })
    })

    //     app.get('product/:id', (req, res) => {
    // .toArray()
    //     })

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})