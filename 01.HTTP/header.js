const expres = require("express");

const app = expres();

app.get("/check-headers", (req, res) => {
  console.log(req.headers); // headers server pe print honge
  res.json({ receivedHeaders: req.headers });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
