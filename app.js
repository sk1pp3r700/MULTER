const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const File = require("./model/fileSchema");

const app = express();

// Configurations for "body-parser"
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));


//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};

//Calling the "multer" Function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


//API Endpoint for uploading file
app.post("/api/uploadFile", upload.single("myFile"), async (req, res) => {
  console.log(req.file);
  try {
    const newFile = await File.create({
      name: req.file.filename,
    });
    res.status(200).json({
      status: "success",
      message: "File created successfully!!",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});


// API Endpoint to render HTML file
app.use("/", (req, res) => {
  res.status(200).render("index");
});



// Express server
module.exports = app;