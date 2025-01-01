const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const profileRoute = require("./routes/profile");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));


//APPLICATION LEVEL MIDDLEWARE TO LOG Requests
const LOG_FILE = path.join(__dirname, "request_logs.txt");
app.use((req, res, next) => {
  const logEntry = `${new Date().toISOString()}-${req.method}-${req.url}\n\n`;
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error("filed to write log file", err);
    }
  });
  next();
});

app.use("/", profileRoute);

//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
  next();
});

const PORT = 3007;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
