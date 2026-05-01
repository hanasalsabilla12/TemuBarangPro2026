const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let laporan = [];

// TAMBAH DATA
app.post("/laporan", (req, res) => {
  laporan.push(req.body);
  res.json({ message: "Data berhasil ditambahkan" });
});

// AMBIL DATA
app.get("/laporan", (req, res) => {
  res.json(laporan);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server jalan di http://localhost:3000");
});