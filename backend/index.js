const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017'; // Your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

client.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MongoDB');

  db = client.db('supermarket'); // Your database name

  // Routes
  // Example: Get all products
  app.get('/products', async (req, res) => {
    try {
      const products = await db.collection('products').find().toArray();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  });

  // Example: Add a new product
  app.post('/products', async (req, res) => {
    const { name, price, quantity } = req.body;
    try {
      const result = await db.collection('products').insertOne({ name, price, quantity });
      res.status(201).json(result.ops[0]);
    } catch (err) {
      res.status(400).json({ message: 'Error creating product' });
    }
  });

  // Other routes for managing orders, customers, etc.

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});

process.on('SIGINT', () => {
  client.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});