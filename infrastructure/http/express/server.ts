// src/infrastructure/http/express/server.ts
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route de test
app.get("/health", (req, res) => {
  res.json({ status: "Express server is running" });
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
