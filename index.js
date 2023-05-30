const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

const productsData = fs.readFileSync('products.json', 'utf8');
const products = JSON.parse(productsData);

app.get('/products', (req, res) => {
  const limit = req.query.limit;
  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});

app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  const product = products.find((product) => product.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'El producto no existe' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});