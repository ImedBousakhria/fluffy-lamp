const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const { initWebSocket } = require("./websocket/productSocket");

// load env vars
dotenv.config();

connectDB();

const app = express();

// load middleware
app.use(
  cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);

const wss = initWebSocket(server);

// make WebSocket server available to routes
app.use((req, res, next) => {
  req.wss = wss;
  next();
});

// actual routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Product Manager API is running!" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
});
