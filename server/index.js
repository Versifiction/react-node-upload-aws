const express = require("express");
const bodyParser = require("body-parser");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();

let db;

const url = process.env.URL;

MongoClient.connect(url, (err, client) => {
  if (err) return console.log(err);
  db = client.db(process.env.DB);
  app.listen(3001, () => {
    console.log("Server listening on port 3001");
  });
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  Bucket: process.env.BUCKET,
});

const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profileImage");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

app.post("/upload/:username", (req, res) => {
  console.log("req ", req.file);
  profileImgUpload(req, res, (error) => {
    console.log("error", error);
    if (error) {
      console.log("errors", error);
      res.json({ error: error });
    } else {
      if (req.file === undefined) {
        res.json("Error: No File Selected");
      } else {
        const imageName = req.file.key;
        const imageLocation = req.file.location;

        db.collection(process.env.COLLECTION).replaceOne(
          { username: req.params.username },
          {
            username: req.params.username,
            fileName: req.file.key,
            fileUrl: req.file.location,
          },
          { upsert: true },
          (err, result) => {}
        );

        res.json({
          image: imageName,
          location: imageLocation,
        });
      }
    }
  });
});

app.get("/photo/:username", (req, res) => {
  db.collection(process.env.COLLECTION).findOne(
    { username: req.params.username },
    (err, result) => {
      if (err) return console.log(err);
      res.send(result);
    }
  );
});
