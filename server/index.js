const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const multer = require("multer");
const fs = require("fs-extra");
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const url = "mongodb://localhost:27017";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

let db;

MongoClient.connect(url, (err, client) => {
  if (err) return console.log(err);
  db = client.db("uploads");
  app.listen(3001, () => {
    console.log("Server listening on port 3001");
  });
});

app.use(cors());

app.get("/", function (req, res) {
  res.json({ message: "Welcome in React Node Upload API" });
});

app.post("/upload", upload.single("myImage"), (req, res) => {
  const img = fs.readFileSync(req.file.path);
  const encode_image = img.toString("base64");
  // Define a JSONobject for the image attributes for saving to database

  const finalImg = {
    contentType: req.file.mimetype,
    image: new Buffer(encode_image, "base64"),
  };
  db.collection("photos").insertOne(finalImg, (err, result) => {
    if (err) return console.log(err);

    res.redirect("/");
  });
});

app.get("/photos", (req, res) => {
  db.collection("photos")
    .find()
    .toArray((err, result) => {
      const imgArray = result.map((element) => element._id);

      if (err) return console.log(err);
      res.send(imgArray);
    });
});

app.get("/photo/:id", (req, res) => {
  var filename = req.params.id;

  db.collection("photos").findOne(
    { _id: ObjectId(filename) },
    (err, result) => {
      if (err) return console.log(err);
      res.contentType(result.contentType);
      res.send(result.image.buffer);
    }
  );
});
