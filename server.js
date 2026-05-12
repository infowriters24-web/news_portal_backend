const express = require("express");
const app = express();
const dotenv = require("dotenv");
const db_connect = require("./utils/db");
const fs = require("fs");
const path = require("path");
dotenv.config();
const cors = require("cors");
const mode = process.env.NODE_ENV || process.env.mode || "development";
const isProduction = mode === "production";
const normalizeOrigin = (origin) => {
  const trimmed = origin.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("localhost") || trimmed.startsWith("127.0.0.1")) {
    return `http://${trimmed}`;
  }
  return `https://${trimmed}`;
};
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);
app.use(
  cors({
    origin: isProduction
      ? allowedOrigins.length
        ? allowedOrigins
        : true
      : ["http://localhost:5173"],
  }),
);
app.use(express.json());

app.use("/", require("./routes/authRoute"));
app.use("/", require("./routes/newsRoute"));

const clientDistPath = path.join(__dirname, "client", "dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => res.send("Hello World!"));
}
db_connect();
const port = process.env.PORT || process.env.port || 4000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
