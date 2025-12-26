const express = require("express");
const { cachedFetch } = require("./services/cacheService");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5000
const APP_VERSION = process.env.APP_VERSION || 'unknown';



app.use(express.json())


app.get("/", (req, res) => {
  res.send("Hello , Express is Running as Docker Image Final Beanstalk deployment")

})

app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'UP',
    version: APP_VERSION,
    timestamp: new Date().toISOString()
  })
})


app.get("/cache/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await cachedFetch(id);
    return res.json(result)

  } catch (e) {
    console.error("Fetch Failed:", e);
    res.status(500).json({ error: "Failed to fetch" });
  }

})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})


// What would you like to do next?

// Here are your options:

// 🚀 Deploy the container on ECS Fargate (serverless)
// 🖥️ Deploy it on EC2 with Docker
// 🐳 Run it with ECS + EC2
// 🌍 Expose it publicly using ALB (Load Balancer)