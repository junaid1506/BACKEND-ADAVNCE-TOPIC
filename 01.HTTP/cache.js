const express = require("express");

const app = express();
const NodeCache = require("node-cache");
const productCache = new NodeCache({ stdTTL: 10 }); // Cache with a TTL of 60 seconds
const redis = require("redis");
redisClient = redis.createClient();
// redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

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

app.get("/users", async (req, res) => {
  const cachedUsers = await redisClient.get("users");
  if (cachedUsers) {
    return res.json({ source: "redis cache", data: JSON.parse(cachedUsers) });
  }
  const users = [
    { id: 1, name: "User A" },
    { id: 2, name: "User B" },
    { id: 3, name: "User C" },
  ];
  await redisClient.setEx("users", 30, JSON.stringify(users)); // Cache for 60 seconds
  res.json({
    source: "db",
    data: users,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
