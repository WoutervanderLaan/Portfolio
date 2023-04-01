const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const formidable = require("formidable");
const fs = require("fs");
const sharp = require("sharp");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.static("src"));

main().catch((err) => console.log(err));

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.bhotizn.mongodb.net/portfolioDB`
  );
}
const resumeSchema = new mongoose.Schema({
  kind: String,
  startDate: Number,
  endDate: Number,
  name: String,
});

const resumeItem = mongoose.model("resumeItem", resumeSchema);

const aboutSchema = new mongoose.Schema({
  text: String,
});

const aboutItem = mongoose.model("aboutItem", aboutSchema);

const portfolioSchema = new mongoose.Schema({
  series: String,
  title: String,
  material: String,
  dimensions: String,
  description: String,
  img: String,
});

const portfolioItem = mongoose.model("portfolioItem", portfolioSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/Portfolio", (req, res) => {
  res.sendFile(__dirname + "/public/portfolio.html");
});

app.get("/Portfolio/Data", (req, res) => {
  portfolioItem.find({}, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      const data = docs;
      res.json(data);
    }
  });
});

app.get("/Resume", (req, res) => {
  res.sendFile(__dirname + "/public/resume.html");
});

app.get("/Resume/Data", (req, res) => {
  resumeItem.find({}, async function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      const data = docs;
      const sortedData = data.sort((a, b) => b.startDate - a.startDate);
      res.json(sortedData);
    }
  });
});

app.get("/About/Data", (req, res) => {
  aboutItem.find({}, async function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      const [data] = docs;
      res.json(data);
    }
  });
});

app.get("/About", (req, res) => {
  res.sendFile(__dirname + "/public/about.html");
});

app.get("/Contact", (req, res) => {
  res.sendFile(__dirname + "/public/contact.html");
});

app.get("/Compose", (req, res) => {
  res.sendFile(__dirname + "/public/compose.html");
});

app.get("/addPortfolio", (req, res) => {
  res.sendFile(__dirname + "/public/addPortfolio.html");
});

app.post("/addPortfolio", (req, res, next) => {
  const form = formidable({});
  form.options.multiples = true;

  form.parse(req, (err, fields, files) => {
    if (err) return next(err);

    const imgFiles = Array.isArray(files.img) ? files.img : [files.img];
    // const { img } = files;
    // const newImgArray = !img.length ? [img] : [...img];

    imgFiles.forEach((img) => {
      const { originalFilename } = img;
      /////// change original filename
      const exceptions = [
        " ",
        "{",
        "}",
        "|",
        "^",
        "~",
        "[",
        "]",
        "`",
        "(",
        ")",
        "$",
        "&",
        "#",
      ];
      const correctedFileName = [...originalFilename]
        .map((symbol) =>
          exceptions.includes(symbol) ? symbol.replace(symbol, "") : symbol
        )
        .join("");

      /////// creating instance of Item for DB
      const newPortfolioItem = new portfolioItem({
        series: fields.series,
        title: fields.title,
        material: fields.material,
        dimensions: fields.dimensions,
        description: fields.description,
        img: correctedFileName,
      });

      /////// setting new path with corrected file name
      const tempFilePath = img.filepath;
      const destinationPath = "public/img/" + correctedFileName;

      ////// reducing filesize and writing file to new path

      sharp(tempFilePath)
        .resize(1200)
        .toFile(destinationPath, async (err, info) => {
          if (err) return next(err);
          console.log(
            `Image ${correctedFileName} resized and saved succesfully to ${destinationPath}`
          );
          await newPortfolioItem.save();
        });
    });
  });
  res.redirect("/addPortfolio");
});

app.post("/Compose/:category", async (req, res) => {
  const { category } = req.params;

  if (category === "About") {
    const newTextContent = req.body.about;
    aboutItem.deleteMany({}, async (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log(docs);
        const newText = new aboutItem({
          text: newTextContent,
        });
        await newText.save();
        console.log("Succesfully modified text.");
        console.log(newText);
      }
    });
  } else {
    const item = new resumeItem({
      kind: category,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      name: req.body.name,
    });
    await item.save();
    console.log("Succesfully added item.");
    console.log(item);
  }
  res.redirect("/Compose");
});

app.post("/Delete", (req, res) => {
  console.log(req.body.name);

  const deleteArray = req.body.name;
  if (typeof deleteArray === "string") {
    resumeItem.deleteOne({ name: deleteArray }, (err, docs) => {
      if (!err) {
        console.log(docs);
        console.log("Succesfully deleted item.");
      }
    });
  } else {
    deleteArray.forEach((item) => {
      resumeItem.deleteOne({ name: item }, (err, docs) => {
        if (!err) {
          console.log(docs);
        }
      });
    });
    console.log("Succesfully deleted items.");
  }
  res.redirect("/Compose");
});

app.listen(3000, () => console.log("Server is listening on port 3000"));
