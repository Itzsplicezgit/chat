const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const multer = require("multer");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(uploadDir));

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    file: req.file.filename,
    original: req.file.originalname
  });
});

// Socket chat
io.on("connection", (socket) => {
  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on", PORT));
