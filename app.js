const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
let count = 1;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  fs.readdir("files", (err, files) => {
    if (err)
      return res.send("Something went wrong while read your Khatabook !!! ");
    else res.render("index", { files });
  });
});

app.get(`/hisaab/:file`, (req, res) => {
  fs.readFile(`./files/${req.params.file}`, (err, data) => {
    if (err) return res.send(err);
    else res.render("show", { data, filename: req.params.file });
  });
});

app.get("/edit/:file", (req, res) => {
  fs.readFile(`./files/${req.params.file}`, "utf-8", (err, data) => {
    if (err) return res.send(err);
    else res.render("file", { data, filename: req.params.file });
  });
});

app.post("/update/:file", (req, res) => {
  fs.writeFile(`./files/${req.params.file}`, req.body.content, (err) => {
    if (err) return res.send(err);
    else res.redirect("/");
  });
});

app.get("/delete/:file", (req, res) => {
  fs.unlink(`./files/${req.params.file}`, (err) => {
    if (err) return res.send(err);
    else res.redirect("/");
  });
});

app.get("/create", function (req, res) {
  res.render("create");
});

app.post("/createhisaab", (req, res) => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let fn = `${day}-${month}-${year}`;
  // fs.writeFile(`./files/${fn}`,req.body.content,(err)=>{
  //     if(err) return res.send(err);
  //     else res.redirect("/")
  // })
  fs.stat(`./files/${fn}.txt`, (err, stats) => {
    if (err) {
      fs.writeFile(`./files/${fn}.txt`, req.body.content, (err) => {
        if (err) return res.send(err);
        else res.redirect("/");
      });
    } else {
      fs.writeFile(`./files/${fn}_${count++}.txt`, req.body.content, (err) => {
        if (err) return res.send(err);
        else res.redirect("/");
      });
    }
  });
});
app.listen(3000);
