const express = require("express");
const app = express();
const NodeCache = require("node-cache");
const productCache = new NodeCache({ stdTTL: 10 }); // Cache with a TTL of 60 seconds

app.get("/", (req, res) => {
  res.header("Content-Type", "text/plain");
  res.header("cache-control", "public, max-age=60");
  res.json({ page: "home", data: " the " });
});

app.get("/products", (req, res) => {
  const cachedProducts = productCache.get("products");
  if (cachedProducts) {
    return res.json({ source: "cache", data: cachedProducts });
  }
  const products = [
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
    { id: 3, name: "Product C" },
  ];

  productCache.set("products", products);

  res.json({
    source: "db",
    data: products,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
